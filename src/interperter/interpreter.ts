import Lexer, {Token, TokenType} from "./lexer.ts";
import Parser, {
    AssignNode,
    AssignStatement,
    BinaryNode, ExpressionStatement,
    ForStatement,
    IfStatement,
    LiteralNode,
    Node,
    PrintStatement,
    Statement,
    UnaryNode, WhileStatement
} from "./parser.ts";

class RuntimeError extends Error {
    constructor(token: Token | null, message: string) {
        super(`[実行時エラー] ${token ? `行 ${token.line}, 列 ${token.column}：` : ""}${message}`);
        this.name = "RuntimeError";
    }
}

type ReturnType = {
    launch: VoidFunction;
}

export default function Interpreter(program: string, stdOut: (text: string) => void, stdError: (text: string) => void): ReturnType {

    const variables: Record<string, string | number | boolean | null> = {};

    const interpretBinary = (node: BinaryNode): string | number | boolean | null => {
        const left = interpretNode(node.left);
        const right = interpretNode(node.right);

        if (typeof left === "string" && typeof right === "string") {
            switch (node.operator) {
                case TokenType.PLUS:
                    return left + right;
            }
        } else if (typeof left === "number" && typeof right === "number") {
            switch (node.operator) {
                case TokenType.PLUS:
                    return left + right;
                case TokenType.MINUS:
                    return left - right;
                case TokenType.MUL:
                    return left * right;
                case TokenType.DIV:
                    return left / right;
                case TokenType.MOD:
                    return left % right;
                case TokenType.EQUAL:
                    return left == right;
                case TokenType.LT:
                    return left < right;
                case TokenType.LE:
                    return left <= right;
                case TokenType.GT:
                    return left > right;
                case TokenType.GE:
                    return left >= right;
            }
        } else if (typeof left === "boolean" && typeof right === "boolean") {
            switch (node.operator) {
                case TokenType.EQUAL:
                    return left == right;
                case TokenType.AND:
                    return left && right;
                case TokenType.OR:
                    return left || right;
            }
        }

        throw new RuntimeError(node.token, "二項演算の左右の値は同じ型である必要があります");
    }

    const interpretUnary = (node: UnaryNode): number => {
        const right = interpretNode(node.right);

        if (typeof right !== "number") {
            throw new RuntimeError(node.token, "単項演算の右の値は数値である必要があります");
        }

        switch (node.operator) {
            case TokenType.MINUS:
                return -right;
        }
    }

    const interpretAssignNode = (node: AssignNode): string | number | boolean | null => {
        const name = node.variableName;
        if (Object.keys(variables).indexOf(name) === -1) {
            throw new RuntimeError(node.token, `変数 ${name} が存在しません`);
        }

        const value = interpretNode(node.value);
        variables[name] = value;

        return value;
    }

    const interpretNode = (node: Node): string | number | boolean | null => {
        switch (node.type) {
            case "string":
            case "number":
            case "null":
            case "true":
            case "false":
                return (node as LiteralNode).value;
            case "identifier": {
                const name = (node as LiteralNode).value as string;
                if (Object.keys(variables).indexOf(name) === -1) {
                    throw new RuntimeError((node as LiteralNode).token, `変数 ${name} が存在しません`);
                }
                return variables[name];
            }
            case "binary":
                return interpretBinary(node as BinaryNode);
            case "unary":
                return interpretUnary(node as UnaryNode);
            case "assign":
                return interpretAssignNode(node as AssignNode);
        }
    }

    const interpretFor = (statement: ForStatement) => {
        const start = interpretNode(statement.start);
        const end = interpretNode(statement.end);

        if (typeof start !== "number" || typeof end !== "number") {
            throw new RuntimeError(null, "for文の開始値と終了値の計算結果は数値である必要があります");
        }

        variables[statement.variable] = start;

        for (let i = start; i < end; i++) {
            interpret(statement.body);
            (variables[statement.variable] as number)++;
        }

        delete variables[statement.variable];
    }

    const interpretIf = (statement: IfStatement) => {
        if (interpretNode(statement.condition)) {
            interpret(statement.body);
        } else {
            for (const elseIfStatement of statement.elseIfStatements) {
                if (interpretNode(elseIfStatement.condition)) {
                    interpret(elseIfStatement.body);
                    return;
                }
            }
            interpret(statement.elseStatement);
        }
    }

    const interpretAssign = (statement: AssignStatement) => {
        if (Object.keys(variables).indexOf(statement.variableName) !== -1) {
            throw new RuntimeError(statement.token, `変数 ${statement.variableName} はすでに存在します`);
        }

        let value = null;
        if (statement.initializer) {
            value = interpretNode(statement.initializer);
        }

        variables[statement.variableName] = value;
    }

    const interpretWhile = (statement: WhileStatement) => {
        while (interpretNode(statement.condition)) {
            interpret(statement.body);
        }
    }

    const interpretExpression = (statement: ExpressionStatement) => {
        interpretNode(statement.expression);
    }

    const interpret = (statements: Statement[]) => {
        try {
            for (const statement of statements) {
                switch (statement.type) {
                    case "print":
                        stdOut(`${interpretNode((statement as PrintStatement).value)}`);
                        break;
                    case "for":
                        interpretFor(statement as ForStatement);
                        break;
                    case "if":
                        interpretIf(statement as IfStatement);
                        break;
                    case "assign":
                        interpretAssign(statement as AssignStatement);
                        break;
                    case "while":
                        interpretWhile(statement as WhileStatement);
                        break;
                    case "expression":
                        interpretExpression((statement as ExpressionStatement));
                }
            }
        } catch (e) {
            if (e instanceof RuntimeError) {
                stdError(e.message);
                throw new Error();
            }
        }
    }

    const launch = () => {
        const lexer = Lexer(program);
        const parser = Parser(lexer.lex(), stdError);
        const statements = parser.parse();
        if (statements) {
            interpret(statements);
        }
    }

    return {
        launch,
    }
}