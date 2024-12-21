import Lexer from "../../lexer.ts";
import Parser from "../../parser.ts";
import {
    AttributeBase,
    ClassAccessFlag,
    ConstantBaseInfo,
    JavaClassFileConstants,
    MAIN_METHOD_ACCESS_FLAGS,
    MAIN_METHOD_DESCRIPTOR,
    MAIN_METHOD_NAME,
    Method,
    NAME_JAVA_LANG_OBJECT,
    PaddingInfo,
} from "./JavaClassFile.ts";
import compileMethod, {createDefaultConstructor} from "./JavaCompiler.ts";
import {createClassInfoFromNameAndAdd, createSourceFileAttribute, serialize} from "./utils.ts";

const MAIN_CLASS_NAME = "EmojinMain";

type ReturningType = {
    compile: (program: string, stdErr: (text: string) => void) => ArrayBuffer
}

export default function JavaCompilerMain(): ReturningType {
    const view = new DataView(new ArrayBuffer(4096));

    /**
     * マジックを書き込む
     */
    const writeMagic = () => {
        view.setUint32(0, JavaClassFileConstants.MAGIC_NUMBER);
    }

    /**
     * バージョンを書き込む
     */
    const writeVersion = () => {
        view.setUint16(4, JavaClassFileConstants.MINOR_VERSION);
        view.setUint16(6, JavaClassFileConstants.MAJOR_VERSION);
    }

    /**
     * 定数プールの数を書き込む
     * @param count
     */
    const writeConstantPoolCount = (count: number) => {
        view.setUint16(8, count);
    }

    /**
     * 定数プールを書き込む
     * @param constantPoolView
     */
    const writeConstantPools = (constantPoolView: DataView) => {
        for (let i = 0; i < constantPoolView.byteLength; i++) {
            view.setUint8(10 + i, constantPoolView.getUint8(i));
        }
    }

    /**
     * アクセスフラグを書き込む
     * @param constantPoolSize
     * @param value
     */
    const writeAccessFlags = (constantPoolSize: number, value: number) => {
        view.setUint16(10 + constantPoolSize, value);
    }

    /**
     * このクラスの定数プールのインデックスを書き込む
     * @param constantPoolSize
     * @param index
     */
    const writeThisClass = (constantPoolSize: number, index: number) => {
        view.setUint16(12 + constantPoolSize, index);
    }

    /**
     * スーパークラスの定数プールのインデックスを書き込む
     * @param constantPoolSize
     * @param index
     */
    const writeSuperClass = (constantPoolSize: number, index: number) => {
        view.setUint16(14 + constantPoolSize, index);
    }

    /**
     * インターフェースの数を書き込む
     * @param constantPoolSize
     * @param count
     */
    const writeInterfacesCount = (constantPoolSize: number, count: number) => {
        view.setUint16(16 + constantPoolSize, count)
    }

    /**
     * インターフェースを書き込む
     * @param constantPoolSize
     * @param interfacesView
     */
    const writeInterfaces = (constantPoolSize: number, interfacesView: DataView) => {
        for (let i = 0; i < interfacesView.byteLength; i++) {
            view.setUint8(18 + constantPoolSize + i, interfacesView.getUint8(i));
        }
    }

    /**
     * フィールドの数を書き込む
     * @param constantPoolSize
     * @param interfacesSize
     * @param count
     */
    const writeFieldsCount = (constantPoolSize: number, interfacesSize: number, count: number) => {
        view.setUint16(18 + constantPoolSize + interfacesSize, count);
    }

    /**
     * フィールドを書き込む
     * @param constantPoolSize
     * @param interfacesSize
     * @param fieldsView
     */
    const writeFields = (constantPoolSize: number, interfacesSize: number, fieldsView: DataView) => {
        for (let i = 0; i < fieldsView.byteLength; i++) {
            view.setUint8(20 + constantPoolSize + interfacesSize + i, fieldsView.getUint8(i));
        }
    }

    /**
     * メソッドの数を書き込む
     * @param constantPoolSize
     * @param interfacesSize
     * @param fieldsSize
     * @param count
     */
    const writeMethodsCount = (constantPoolSize: number, interfacesSize: number, fieldsSize: number, count: number) => {
        view.setUint16(20 + constantPoolSize + interfacesSize + fieldsSize, count);
    }

    /**
     * メソッドを書き込む
     * @param constantPoolSize
     * @param interfacesSize
     * @param fieldsSize
     * @param methodsView
     */
    const writeMethods = (constantPoolSize: number, interfacesSize: number, fieldsSize: number, methodsView: DataView) => {
        for (let i = 0; i < methodsView.byteLength; i++) {
            view.setUint8(22 + constantPoolSize + interfacesSize + fieldsSize + i, methodsView.getUint8(i));
        }
    }

    /**
     * 属性の数を書き込む
     * @param constantPoolSize
     * @param interfacesSize
     * @param fieldsSize
     * @param methodsSize
     * @param count
     */
    const writeAttributesCount = (constantPoolSize: number, interfacesSize: number, fieldsSize: number, methodsSize: number, count: number) => {
        view.setUint16(22 + constantPoolSize + interfacesSize + fieldsSize + methodsSize, count);
    }

    /**
     * 属性を書き込む
     * @param constantPoolSize
     * @param interfacesSize
     * @param fieldsSize
     * @param methodsSize
     * @param attributesView
     */
    const writeAttributes = (constantPoolSize: number, interfacesSize: number, fieldsSize: number, methodsSize: number, attributesView: DataView) => {
        for (let i = 0; i < attributesView.byteLength; i++) {
            view.setUint8(24 + constantPoolSize + interfacesSize + fieldsSize + methodsSize + i, attributesView.getUint8(i));
        }
    }

    const constantPools: ConstantBaseInfo[] = [new PaddingInfo()];
    const attributes: AttributeBase[] = [];
    const methods: Method[] = [];

    const compile = (program: string, stdError: (text: string) => void): ArrayBuffer => {
        const lexer = Lexer(program);
        const parser = Parser(lexer.lex(), stdError);
        const statements = parser.parse();

        // デフォルトコンストラクタを追加
        methods.push(createDefaultConstructor(constantPools));

        // main メソッドを追加
        methods.push(compileMethod(
            MAIN_METHOD_NAME,
            MAIN_METHOD_DESCRIPTOR,
            MAIN_METHOD_ACCESS_FLAGS,
            constantPools,
            statements,
        ));

        // SourceFile 属性を追加
        attributes.push(createSourceFileAttribute(constantPools, `${MAIN_CLASS_NAME}.java`));

        // このクラスとスーパークラスの定数プールを追加
        const thisClassIndex = createClassInfoFromNameAndAdd(constantPools, MAIN_CLASS_NAME);
        const superClassIndex = createClassInfoFromNameAndAdd(constantPools, NAME_JAVA_LANG_OBJECT);

        // 各データをシリアライズする
        const attributesView = serialize(attributes);
        const constantPoolView = serialize(constantPools);
        const methodsView = serialize(methods);

        // NOTE: emojin では使わないので空
        const interfacesView = new DataView(new ArrayBuffer(0));
        const fieldsView = new DataView(new ArrayBuffer(0));

        writeMagic();
        writeVersion();
        writeConstantPoolCount(constantPools.length);
        writeConstantPools(constantPoolView);
        writeAccessFlags(constantPoolView.byteLength, ClassAccessFlag.PUBLIC);
        writeThisClass(constantPoolView.byteLength, thisClassIndex);
        writeSuperClass(constantPoolView.byteLength, superClassIndex);
        writeInterfacesCount(constantPoolView.byteLength, 0);
        writeInterfaces(constantPoolView.byteLength, interfacesView);
        writeFieldsCount(constantPoolView.byteLength, interfacesView.byteLength, 0);
        writeFields(constantPoolView.byteLength, interfacesView.byteLength, fieldsView);
        writeMethodsCount(constantPoolView.byteLength, interfacesView.byteLength, fieldsView.byteLength, methods.length);
        writeMethods(constantPoolView.byteLength, interfacesView.byteLength, fieldsView.byteLength, methodsView);
        writeAttributesCount(constantPoolView.byteLength, interfacesView.byteLength, fieldsView.byteLength, methodsView.byteLength, attributes.length);
        writeAttributes(constantPoolView.byteLength, interfacesView.byteLength, fieldsView.byteLength, methodsView.byteLength, attributesView);

        const size = 24
            + constantPoolView.byteLength
            + interfacesView.byteLength
            + fieldsView.byteLength
            + methodsView.byteLength
            + attributesView.byteLength;

        const result = view.buffer.slice(0, size);

        console.clear();
        console.log("パース結果", statements);
        console.log("定数プール", constantPools);
        console.log("デフォルトコンストラクタ", methods[0]);
        console.log("main メソッド", methods[1]);
        console.log("属性", attributes);
        console.log("コンパイル結果", result);

        return result;
    }

    return {
        compile
    }
}