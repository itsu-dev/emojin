import {
    AttributeBase,
    AttributeName,
    CodeAttribute,
    ConstantBaseInfo,
    INIT_METHOD_ACCESS_FLAGS_DEFAULT,
    INIT_METHOD_DESCRIPTOR_DEFAULT,
    INIT_METHOD_NAME,
    Method, NAME_JAVA_IO_PRINT_STREAM,
    NAME_JAVA_LANG_OBJECT, NAME_JAVA_LANG_STRING, NAME_JAVA_LANG_SYSTEM, NAME_OUT, NAME_PRINT_LN,
    Utf8Info
} from "./JavaClassFile.ts";
import {BinaryNode, ForStatement, IfStatement, LiteralNode, Node, PrintStatement, Statement} from "../../parser.ts";
import {
    addToConstantPool,
    createFieldRefInfoFromNameAndAdd,
    createMethodRefInfoFromNameAndAdd,
    createStringInfoFromValueAndAdd,
} from "./utils.ts";
import {getIConstByValue, getILoadByIndex, getIStoreByIndex, Instructions} from "./Instructions.ts";
import {TokenType} from "../../lexer.ts";

/**
 * メソッドをコンパイルする
 * @param name
 * @param descriptor
 * @param accessFlags
 * @param argsSize
 * @param constantPools このメソッドによって更新される
 * @param statements 無い場合，デフォルトのコンストラクタを生成する
 */
export default function compileMethod(
    name: string,
    descriptor: string,
    accessFlags: number,
    constantPools: ConstantBaseInfo[],
    stmts: Statement[],
): Method {
    const PLACE_HOLDER = -255;

    const localMap = new Map<string, number>();

    const buffer: number[] = [];
    let maxStack = 0;
    let stackSize = 0;

    // NOTE: 本当はdescriptorからargsSizeを計算して初期化しておくべき
    let localSize = 1;

    /** 新しいローカル変数を使う */
    function newLocal(name: string): number {
        localSize++;
        localMap.set(name, localSize - 1);
        return localSize - 1;
    }

    /** ローカル変数のインデックスを取得する */
    function getLocal(name: string): number {
        return localMap.get(name) ?? -1;
    }

    /** 現在位置 */
    function current(): number {
        return buffer.length;
    }

    /** 直近のプレースホルダの位置を算出する */
    function nearestPlaceholder(): number {
        for (let i = current() - 1; i >= 0; i--) {
            if (buffer[i] === PLACE_HOLDER) {
                return i;
            }
        }
        return -1;
    }

    /** スタックに効果を与える */
    function effectStack(effect: number) {
        if (maxStack < stackSize + effect) {
            maxStack = stackSize + effect;
        }
        stackSize += effect;
    }

    function integerLiteral(expr: LiteralNode) {
        const value = expr.value as number;
        const inst = getIConstByValue(value);
        buffer.push(inst);

        if (inst === Instructions.BIPush) {
            buffer.push(value);
        } else if (inst === Instructions.SIPush) {
            buffer.push(value >> 8);
            buffer.push(value & 0xff);
        }

        effectStack(1);
    }

    function binary(expr: BinaryNode) {
        expression(expr.left);
        expression(expr.right);

        switch (expr.operator) {
            case TokenType.PLUS:
                buffer.push(Instructions.IAdd);
                effectStack(-1);
                break;
            case TokenType.MINUS:
                buffer.push(Instructions.ISub);
                effectStack(-1);
                break;
            case TokenType.MOD:
                buffer.push(Instructions.IRem);
                effectStack(-1);
                break;
            case TokenType.MUL:
                buffer.push(Instructions.IMul);
                effectStack(-1);
                break;
            case TokenType.DIV:
                buffer.push(Instructions.IDiv);
                effectStack(-1);
                break;
        }

        effectStack(-1);
    }

    function identifier(expr: LiteralNode) {
        const index = getLocal(expr.value as string);
        iLoad(index);
    }

    function stringLiteral(expr: LiteralNode) {
        const index = createStringInfoFromValueAndAdd(constantPools, expr.value as string);
        buffer.push(Instructions.LDC);
        buffer.push(index);
        effectStack(1);
    }

    function expression(expr: Node) {
        switch (expr.type) {
            case "integer":
                integerLiteral(expr as LiteralNode);
                break;
            case "binary":
                binary(expr as BinaryNode);
                break;
            case "identifier":
                identifier(expr as LiteralNode);
                break;
            case "string":
                stringLiteral(expr as LiteralNode);
                break;
        }
    }

    function iStore(index: number) {
        const inst = getIStoreByIndex(index);
        buffer.push(inst);

        if (inst === Instructions.IStore) {
            buffer.push(index);
        }

        effectStack(-1);
    }

    function iLoad(index: number) {
        const inst = getILoadByIndex(index);
        buffer.push(inst);

        if (inst === Instructions.ILoad) {
            buffer.push(index);
        }

        effectStack(1);
    }

    function forStatement(stmt: ForStatement) {
        // 初期化式
        expression(stmt.start);

        // インデックス変数のローカル変数インデックス
        const forVariableIndex = newLocal(stmt.variable);

        // 初期化式の実行結果をforVariableIndexに保存
        iStore(forVariableIndex);

        // ループの開始位置
        const loopStart = current() + 65536;

        // 条件式の評価
        iLoad(forVariableIndex);
        expression(stmt.end);

        const offset = current();
        buffer.push(Instructions.IfICmpGe);
        buffer.push(PLACE_HOLDER);
        buffer.push(PLACE_HOLDER);
        effectStack(-2);

        // ループの中身
        statements(stmt.body);

        // インクリメント
        buffer.push(Instructions.IInc);
        buffer.push(forVariableIndex);
        buffer.push(1);

        // ループの終了位置
        const c = current();
        buffer.push(Instructions.Goto);
        buffer.push((loopStart - c) >> 8);
        buffer.push((loopStart - c) & 0xff);

        // プレースホルダを埋める
        const loopNext = current() - offset;
        const placeHolderIndex = nearestPlaceholder() - 1;
        buffer[placeHolderIndex] = loopNext >> 8;
        buffer[placeHolderIndex + 1] = loopNext & 0xff;
    }

    function ifStatement(stmt: IfStatement) {
        // 条件式の評価
        expression(stmt.condition);

        // 条件式の結果を評価
        const offset = current();
        buffer.push(Instructions.IfNe);
        buffer.push(PLACE_HOLDER);
        buffer.push(PLACE_HOLDER);
        effectStack(-1);

        statements(stmt.body);

        // プレースホルダを埋める
        const next = current() - offset;
        const placeHolderIndex = nearestPlaceholder() - 1;
        buffer[placeHolderIndex] = next >> 8;
        buffer[placeHolderIndex + 1] = next & 0xff;

        // else if
        for (const elseIf of [...stmt.elseIfStatements]) {
            ifStatement(elseIf);
        }

        // else
        if (stmt.elseStatement) {
            statements(stmt.elseStatement);
        }
    }

    function printStatement(stmt: PrintStatement) {
        const fieldRef = createFieldRefInfoFromNameAndAdd(
            constantPools,
            NAME_JAVA_LANG_SYSTEM,
            NAME_OUT,
            `L${NAME_JAVA_IO_PRINT_STREAM};`
        );
        buffer.push(Instructions.GetStatic);
        buffer.push(fieldRef >> 8);
        buffer.push(fieldRef & 0xff);
        effectStack(-1);

        expression(stmt.value);

        const argType = stmt.value.type === "string" ? `L${NAME_JAVA_LANG_STRING};` : "I";
        const methodRef = createMethodRefInfoFromNameAndAdd(
            constantPools,
            NAME_JAVA_IO_PRINT_STREAM,
            NAME_PRINT_LN,
            `(${argType})V`
        );

        buffer.push(Instructions.InvokeVirtual);
        buffer.push(methodRef >> 8);
        buffer.push(methodRef & 0xff);
        effectStack(-2);
    }

    function statement(stmt: Statement) {
        switch (stmt.type) {
            case "if":
                ifStatement(stmt as IfStatement);
                break;
            case "for":
                forStatement(stmt as ForStatement);
                break;
            case "print":
                printStatement(stmt as PrintStatement);
                break;
        }
    }

    function statements(statements: Statement[]) {
        for (const stmt of statements) {
            statement(stmt);
        }
    }

    statements(stmts);
    buffer.push(Instructions.Return);

    console.log(buffer);

    const code = new DataView(new Uint8Array(buffer).buffer);
    const nameIndex = addToConstantPool(constantPools, new Utf8Info(name));
    const descriptorIndex = addToConstantPool(constantPools, new Utf8Info(descriptor));
    const codeNameIndex = addToConstantPool(constantPools, new Utf8Info(AttributeName.CODE));
    const codeAttribute = new CodeAttribute(codeNameIndex, maxStack, localSize, code, new DataView(new ArrayBuffer(0)), []);
    const attributes: AttributeBase[] = [codeAttribute];

    return new Method(accessFlags, nameIndex, descriptorIndex, attributes);
}

/**
 * デフォルトのコンストラクタを生成する
 * @param constantPools
 */
export function createDefaultConstructor(constantPools: ConstantBaseInfo[]): Method {
    const code = new DataView(new ArrayBuffer(5));
    code.setUint8(0, Instructions.ALoad0);

    const methodRefInfo = createMethodRefInfoFromNameAndAdd(
        constantPools, NAME_JAVA_LANG_OBJECT, INIT_METHOD_NAME, INIT_METHOD_DESCRIPTOR_DEFAULT
    );
    code.setUint8(1, Instructions.InvokeSpecial);
    code.setUint16(2, methodRefInfo);

    code.setUint8(4, Instructions.Return);

    const codeNameIndex = addToConstantPool(constantPools, new Utf8Info(AttributeName.CODE));
    const codeAttribute = new CodeAttribute(codeNameIndex, 1, 1, code, new DataView(new ArrayBuffer(0)), []);

    const nameIndex = addToConstantPool(constantPools, new Utf8Info(INIT_METHOD_NAME));
    const descriptorIndex = addToConstantPool(constantPools, new Utf8Info(INIT_METHOD_DESCRIPTOR_DEFAULT));
    const attributes: AttributeBase[] = [codeAttribute];

    return new Method(
        INIT_METHOD_ACCESS_FLAGS_DEFAULT,
        nameIndex, descriptorIndex, attributes
    );
}