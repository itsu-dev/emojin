import { serialize as _serialize } from "./utils";

export enum JavaClassFileConstants {
    MAGIC_NUMBER = 0xCAFEBABE,
    MAJOR_VERSION = 52,  // Java 8
    MINOR_VERSION = 0
}

export enum ClassAccessFlag {
    PUBLIC = 0x0001,
    FINAL = 0x0010,
    SUPER = 0x0020,
    INTERFACE = 0x0200,
    ABSTRACT = 0x0400,
    SYNTHETIC = 0x1000,
    ANNOTATION = 0x2000,
    ENUM = 0x4000
}

export enum MethodAccessFlag {
    PUBLIC = 0x0001,
    PRIVATE = 0x0002,
    PROTECTED = 0x0004,
    STATIC = 0x0008,
    FINAL = 0x0010,
    SYNCHRONIZED = 0x0020,
    BRIDGE = 0x0040,
    VARARGS = 0x0080,
    NATIVE = 0x0100,
    ABSTRACT = 0x0400,
    STRICT = 0x0800,
    SYNTHETIC = 0x1000
}

// Constant Pool
export enum ConstantPoolTag {
    _UNUSED = 0,
    UTF8 = 1,
    INTEGER = 3,
    FLOAT = 4,
    LONG = 5,
    DOUBLE = 6,
    CLASS = 7,
    STRING = 8,
    FIELD_REF = 9,
    METHOD_REF = 10,
    INTERFACE_METHOD_REF = 11,
    NAME_AND_TYPE = 12,
    // invokedynamic系命令はサポートしない
    // METHOD_HANDLE = 15,
    // METHOD_TYPE = 16,
    // INVOKE_DYNAMIC = 18
}

export interface Serializable {
    serialize(): DataView;
}

export interface ConstantBaseInfo extends Serializable {
    readonly tag: ConstantPoolTag;
}

export class PaddingInfo implements ConstantBaseInfo {
    readonly tag = ConstantPoolTag._UNUSED;
    serialize(): DataView {
        return new DataView(new ArrayBuffer(0));
    }
}

export class ClassInfo implements ConstantBaseInfo {
    readonly tag = ConstantPoolTag.CLASS;
    nameIndex: number;

    constructor(nameIndex: number) {
        this.nameIndex = nameIndex;
    }

    serialize(): DataView {
        const view = new DataView(new ArrayBuffer(3));
        view.setUint8(0, this.tag);
        view.setUint16(1, this.nameIndex);
        return view;
    }
}

export class FieldRefInfo implements ConstantBaseInfo {
    readonly tag = ConstantPoolTag.FIELD_REF;
    classIndex: number;
    nameAndTypeIndex: number;

    constructor(classIndex: number, nameAndTypeIndex: number) {
        this.classIndex = classIndex;
        this.nameAndTypeIndex = nameAndTypeIndex;
    }

    serialize(): DataView {
        const view = new DataView(new ArrayBuffer(5));
        view.setUint8(0, this.tag);
        view.setUint16(1, this.classIndex);
        view.setUint16(3, this.nameAndTypeIndex);
        return view;
    }
}

export class MethodRefInfo implements ConstantBaseInfo {
    readonly tag = ConstantPoolTag.METHOD_REF;
    classIndex: number;
    nameAndTypeIndex: number;

    constructor(classIndex: number, nameAndTypeIndex: number) {
        this.classIndex = classIndex;
        this.nameAndTypeIndex = nameAndTypeIndex;
    }

    serialize(): DataView {
        const view = new DataView(new ArrayBuffer(5));
        view.setUint8(0, this.tag);
        view.setUint16(1, this.classIndex);
        view.setUint16(3, this.nameAndTypeIndex);
        return view;
    }
}

export class InterfaceMethodRefInfo implements ConstantBaseInfo {
    readonly tag = ConstantPoolTag.INTERFACE_METHOD_REF;
    classIndex: number;
    nameAndTypeIndex: number;

    constructor(classIndex: number, nameAndTypeIndex: number) {
        this.classIndex = classIndex;
        this.nameAndTypeIndex = nameAndTypeIndex;
    }

    serialize(): DataView {
        const view = new DataView(new ArrayBuffer(5));
        view.setUint8(0, this.tag);
        view.setUint16(1, this.classIndex);
        view.setUint16(3, this.nameAndTypeIndex);
        return view;
    }
}

export class StringInfo implements ConstantBaseInfo {
    readonly tag = ConstantPoolTag.STRING;
    stringIndex: number;

    constructor(stringIndex: number) {
        this.stringIndex = stringIndex;
    }

    serialize(): DataView {
        const view = new DataView(new ArrayBuffer(3));
        view.setUint8(0, this.tag);
        view.setUint16(1, this.stringIndex);
        return view;
    }
}

export class IntegerInfo implements ConstantBaseInfo {
    readonly tag = ConstantPoolTag.INTEGER;
    value: number;

    constructor(value: number) {
        this.value = value;
    }

    serialize(): DataView {
        const view = new DataView(new ArrayBuffer(5));
        view.setUint8(0, this.tag);
        view.setInt32(1, this.value);
        return view;
    }
}

export class FloatInfo implements ConstantBaseInfo {
    readonly tag = ConstantPoolTag.FLOAT;
    value: number;

    constructor(value: number) {
        this.value = value;
    }

    serialize(): DataView {
        const view = new DataView(new ArrayBuffer(5));
        view.setUint8(0, this.tag);
        view.setFloat32(1, this.value);
        return view;
    }
}

export class LongInfo implements ConstantBaseInfo {
    readonly tag = ConstantPoolTag.LONG;
    value: number;

    constructor(value: number) {
        this.value = value;
    }

    serialize(): DataView {
        const view = new DataView(new ArrayBuffer(9));
        view.setUint8(0, this.tag);
        view.setBigInt64(1, BigInt(this.value));
        return view;
    }
}

export class DoubleInfo implements ConstantBaseInfo {
    readonly tag = ConstantPoolTag.DOUBLE;
    value: number;

    constructor(value: number) {
        this.value = value;
    }

    serialize(): DataView {
        const view = new DataView(new ArrayBuffer(9));
        view.setUint8(0, this.tag);
        view.setFloat64(1, this.value);
        return view;
    }
}

export class NameAndTypeInfo implements ConstantBaseInfo {
    readonly tag = ConstantPoolTag.NAME_AND_TYPE;
    nameIndex: number;
    descriptorIndex: number;

    constructor(nameIndex: number, descriptorIndex: number) {
        this.nameIndex = nameIndex;
        this.descriptorIndex = descriptorIndex;
    }

    serialize(): DataView {
        const view = new DataView(new ArrayBuffer(5));
        view.setUint8(0, this.tag);
        view.setUint16(1, this.nameIndex);
        view.setUint16(3, this.descriptorIndex);
        return view;
    }
}

export class Utf8Info implements ConstantBaseInfo {
    readonly tag = ConstantPoolTag.UTF8;
    value: string;

    constructor(value: string) {
        this.value = value;
    }

    serialize(): DataView {
        const encoder = new TextEncoder();
        const bytes = encoder.encode(this.value);
        const view = new DataView(new ArrayBuffer(3 + bytes.byteLength));
        view.setUint8(0, this.tag);
        view.setUint16(1, bytes.byteLength);
        for (let i = 0; i < bytes.byteLength; i++) {
            view.setUint8(3 + i, bytes[i]);
        }
        return view;
    }
}

// Attributes
export enum AttributeName {
    CODE = "Code",
    CONSTANT_VALUE = "ConstantValue",
    DEPRECATED = "Deprecated",
    EXCEPTIONS = "Exceptions",
    INNER_CLASSES = "InnerClasses",
    LINE_NUMBER_TABLE = "LineNumberTable",
    LOCAL_VARIABLE_TABLE = "LocalVariableTable",
    SOURCE_FILE = "SourceFile",
    SYNTHETIC = "Synthetic"
}

export interface AttributeBase extends Serializable {
    readonly nameIndex: number;
}

export class CodeAttribute implements AttributeBase {
    nameIndex: number;
    maxStack: number;
    maxLocals: number;
    code: DataView;
    exceptionTable: DataView;
    attributes: AttributeBase[];

    constructor(nameIndex: number, maxStack: number, maxLocals: number, code: DataView, exceptionTable: DataView, attributes: AttributeBase[]) {
        this.nameIndex = nameIndex;
        this.maxStack = maxStack;
        this.maxLocals = maxLocals;
        this.code = code;
        this.exceptionTable = exceptionTable;
        this.attributes = attributes;
    }

    serialize(): DataView {
        const attributesView = _serialize(this.attributes);
        const view = new DataView(new ArrayBuffer(2048));

        view.setUint16(0, this.nameIndex);
        view.setUint32(2, 12 + this.code.byteLength + this.exceptionTable.byteLength + attributesView.byteLength);
        view.setUint16(6, this.maxStack);
        view.setUint16(8, this.maxLocals);

        view.setUint32(10, this.code.byteLength);
        for (let i = 0; i < this.code.byteLength; i++) {
            view.setUint8(14 + i, this.code.getUint8(i));
        }

        const offset = 14 + this.code.byteLength;

        view.setUint16(offset, this.exceptionTable.byteLength);
        for (let i = 0; i < this.exceptionTable.byteLength; i++) {
            view.setUint8(offset + 2 + i, this.exceptionTable.getUint8(i));
        }

        const offset2 = offset + 2 + this.exceptionTable.byteLength;

        view.setUint16(offset2, this.attributes.length);
        for (let i = 0; i < this.attributes.length; i++) {
            const serialized = this.attributes[i].serialize();
            for (let j = 0; j < serialized.byteLength; j++) {
                view.setUint8(offset2 + 2 + j, serialized.getUint8(j));
            }
        }

        const size = offset2 + 2 + attributesView.byteLength;
        return new DataView(view.buffer.slice(0, size));
    }
}

export class SourceFileAttribute implements AttributeBase {
    nameIndex: number;
    sourceFileIndex: number;

    constructor(nameIndex: number, sourceFileIndex: number) {
        this.nameIndex = nameIndex;
        this.sourceFileIndex = sourceFileIndex;
    }

    serialize(): DataView {
        const view = new DataView(new ArrayBuffer(8));
        view.setUint16(0, this.nameIndex);
        view.setUint32(2, 2);
        view.setUint16(6, this.sourceFileIndex);
        return view;
    }
}

// Method
export class Method implements Serializable {
    accessFlags: number;
    nameIndex: number;
    descriptorIndex: number;
    attributes: AttributeBase[];

    constructor(accessFlags: number, nameIndex: number, descriptorIndex: number, attributes: AttributeBase[]) {
        this.accessFlags = accessFlags;
        this.nameIndex = nameIndex;
        this.descriptorIndex = descriptorIndex;
        this.attributes = attributes;
    }

    serialize(): DataView {
        const attributesView = _serialize(this.attributes);

        const view = new DataView(new ArrayBuffer(8 + attributesView.byteLength));
        view.setUint16(0, this.accessFlags);
        view.setUint16(2, this.nameIndex);
        view.setUint16(4, this.descriptorIndex);
        view.setUint16(6, this.attributes.length);

        for (let i = 0; i < attributesView.byteLength; i++) {
            view.setUint8(8 + i, attributesView.getUint8(i));
        }

        return view;
    }
}

export const NAME_JAVA_LANG_OBJECT = "java/lang/Object";
export const NAME_JAVA_LANG_SYSTEM = "java/lang/System";
export const NAME_JAVA_LANG_STRING = "java/lang/String";
export const NAME_JAVA_IO_PRINT_STREAM = "java/io/PrintStream";
export const NAME_OUT = "out";
export const NAME_PRINT_LN = "println";

export const INIT_METHOD_NAME = "<init>";
export const INIT_METHOD_DESCRIPTOR_DEFAULT = "()V";
export const INIT_METHOD_ACCESS_FLAGS_DEFAULT = 0;

export const MAIN_METHOD_NAME = "main";
export const MAIN_METHOD_DESCRIPTOR = "([Ljava/lang/String;)V";
export const MAIN_METHOD_ACCESS_FLAGS = MethodAccessFlag.PUBLIC | MethodAccessFlag.STATIC;
