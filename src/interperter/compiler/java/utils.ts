import {
    AttributeName,
    ClassInfo,
    ConstantBaseInfo,
    ConstantPoolTag, FieldRefInfo, MethodRefInfo, NameAndTypeInfo,
    PaddingInfo, Serializable,
    SourceFileAttribute, StringInfo,
    Utf8Info
} from "./JavaClassFile.ts";
import _ from "lodash";

/**
 * 定数プールに追加する
 * @param constantPools
 * @param info
 * @returns 追加したインデックス
 */
export const addToConstantPool = (constantPools: ConstantBaseInfo[], info: ConstantBaseInfo): number => {
    const index = constantPools.findIndex((c) => _.isEqual(c, info));
    if (index === -1) {
        constantPools.push(info);

        if (info.tag === ConstantPoolTag.LONG || info.tag === ConstantPoolTag.DOUBLE) {
            constantPools.push(new PaddingInfo());
        }

        return constantPools.length - 1;
    } else {
        return index;
    }
}

export const serialize = (data: Serializable[]): DataView => {
    let size = 0;
    for (const datum of data) {
        size += datum.serialize().byteLength;
    }

    const view = new DataView(new ArrayBuffer(size));
    let index = 0;
    for (const datum of data) {
        const serialized = datum.serialize();
        for (let i = 0; i < serialized.byteLength; i++) {
            view.setUint8(index + i, serialized.getUint8(i));
        }
        index += serialized.byteLength;
    }

    return view;
}

export const createClassInfoFromNameAndAdd = (constantPools: ConstantBaseInfo[], name: string): number => {
    const utf8Info = new Utf8Info(name);
    const nameIndex = addToConstantPool(constantPools, utf8Info);
    return addToConstantPool(constantPools, new ClassInfo(nameIndex));
}

export const createNameAndTypeRefInfoFromNameAndAdd = (constantPools: ConstantBaseInfo[], name: string, descriptor: string): number => {
    const nameIndex = addToConstantPool(constantPools, new Utf8Info(name));
    const descriptorIndex = addToConstantPool(constantPools, new Utf8Info(descriptor));
    return addToConstantPool(constantPools, new NameAndTypeInfo(nameIndex, descriptorIndex));
}

export const createMethodRefInfoFromNameAndAdd = (constantPools: ConstantBaseInfo[], className: string, methodName: string, descriptor: string): number => {
    const classIndex = createClassInfoFromNameAndAdd(constantPools, className);
    const nameAndTypeIndex = createNameAndTypeRefInfoFromNameAndAdd(constantPools, methodName, descriptor);
    return addToConstantPool(constantPools, new MethodRefInfo(classIndex, nameAndTypeIndex));
}

export const createStringInfoFromValueAndAdd = (constantPools: ConstantBaseInfo[], value: string): number => {
    const stringIndex = addToConstantPool(constantPools, new Utf8Info(value));
    return addToConstantPool(constantPools, new StringInfo(stringIndex));
}

export const createFieldRefInfoFromNameAndAdd = (constantPools: ConstantBaseInfo[], className: string, fieldName: string, descriptor: string): number => {
    const classIndex = createClassInfoFromNameAndAdd(constantPools, className);
    const nameAndTypeIndex = createNameAndTypeRefInfoFromNameAndAdd(constantPools, fieldName, descriptor);
    return addToConstantPool(constantPools, new FieldRefInfo(classIndex, nameAndTypeIndex));
}

export const createSourceFileAttribute = (constantPools: ConstantBaseInfo[], sourceFileName: string): SourceFileAttribute => {
    const nameIndex = addToConstantPool(constantPools, new Utf8Info(AttributeName.SOURCE_FILE));
    const sourceFileIndex = addToConstantPool(constantPools, new Utf8Info(sourceFileName));
    return new SourceFileAttribute(nameIndex, sourceFileIndex);
}