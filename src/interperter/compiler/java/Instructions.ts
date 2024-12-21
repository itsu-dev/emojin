export enum Instructions {
    NOP = 0x00,
    AConstNull = 0x01,
    IConstM1 = 0x02,
    IConst0 = 0x03,
    IConst1 = 0x04,
    IConst2 = 0x05,
    IConst3 = 0x06,
    IConst4 = 0x07,
    IConst5 = 0x08,
    LConst0 = 0x09,
    LConst1 = 0x0A,
    FConst0 = 0x0B,
    FConst1 = 0x0C,
    FConst2 = 0x0D,
    DConst0 = 0x0E,
    DConst1 = 0x0F,
    BIPush = 0x10,
    SIPush = 0x11,
    LDC = 0x12,
    LDC_W = 0x13,
    LDC2_W = 0x14,
    ILoad = 0x15,
    LLoad = 0x16,
    FLoad = 0x17,
    DLoad = 0x18,
    ALoad = 0x19,
    ILoad0 = 0x1A,
    ILoad1 = 0x1B,
    ILoad2 = 0x1C,
    ILoad3 = 0x1D,
    LLoad0 = 0x1E,
    LLoad1 = 0x1F,
    LLoad2 = 0x20,
    LLoad3 = 0x21,
    FLoad0 = 0x22,
    FLoad1 = 0x23,
    FLoad2 = 0x24,
    FLoad3 = 0x25,
    DLoad0 = 0x26,
    DLoad1 = 0x27,
    DLoad2 = 0x28,
    DLoad3 = 0x29,
    ALoad0 = 0x2A,
    ALoad1 = 0x2B,
    ALoad2 = 0x2C,
    ALoad3 = 0x2D,
    IALoad = 0x2E,
    LALoad = 0x2F,
    FALoad = 0x30,
    DALoad = 0x31,
    AALoad = 0x32,
    BALoad = 0x33,
    CALoad = 0x34,
    SALoad = 0x35,
    IStore = 0x36,
    LStore = 0x37,
    FStore = 0x38,
    DStore = 0x39,
    AStore = 0x3A,
    IStore0 = 0x3B,
    IStore1 = 0x3C,
    IStore2 = 0x3D,
    IStore3 = 0x3E,
    LStore0 = 0x3F,
    LStore1 = 0x40,
    LStore2 = 0x41,
    LStore3 = 0x42,
    FStore0 = 0x43,
    FStore1 = 0x44,
    FStore2 = 0x45,
    FStore3 = 0x46,
    DStore0 = 0x47,
    DStore1 = 0x48,
    DStore2 = 0x49,
    DStore3 = 0x4A,
    AStore0 = 0x4B,
    AStore1 = 0x4C,
    AStore2 = 0x4D,
    AStore3 = 0x4E,
    IAStore = 0x4F,
    LAStore = 0x50,
    FAStore = 0x51,
    DAStore = 0x52,
    AAStore = 0x53,
    BAStore = 0x54,
    CAStore = 0x55,
    SAStore = 0x56,
    Pop = 0x57,
    Pop2 = 0x58,
    Dup = 0x59,
    DupX1 = 0x5A,
    DupX2 = 0x5B,
    Dup2 = 0x5C,
    Dup2X1 = 0x5D,
    Dup2X2 = 0x5E,
    Swap = 0x5F,
    IAdd = 0x60,
    LAdd = 0x61,
    FAdd = 0x62,
    DAdd = 0x63,
    ISub = 0x64,
    LSub = 0x65,
    FSub = 0x66,
    DSub = 0x67,
    IMul = 0x68,
    LMul = 0x69,
    FMul = 0x6A,
    DMul = 0x6B,
    IDiv = 0x6C,
    LDiv = 0x6D,
    FDiv = 0x6E,
    DDiv = 0x6F,
    IRem = 0x70,
    LRem = 0x71,
    FRem = 0x72,
    DRem = 0x73,
    INeg = 0x74,
    LNeg = 0x75,
    FNeg = 0x76,
    DNeg = 0x77,
    IShL = 0x78,
    LShL = 0x79,
    IShR = 0x7A,
    LShR = 0x7B,
    IUShr = 0x7C,
    LUShr = 0x7D,
    IAnd = 0x7E,
    LAnd = 0x7F,
    IOr = 0x80,
    LOr = 0x81,
    IXor = 0x82,
    LXor = 0x83,
    IInc = 0x84,
    I2L = 0x85,
    I2F = 0x86,
    I2D = 0x87,
    L2I = 0x88,
    L2F = 0x89,
    L2D = 0x8A,
    F2I = 0x8B,
    F2L = 0x8C,
    F2D = 0x8D,
    D2I = 0x8E,
    D2L = 0x8F,
    D2F = 0x90,
    I2B = 0x91,
    I2C = 0x92,
    I2S = 0x93,
    LCmp = 0x94,
    FCmpL = 0x95,
    FCmpG = 0x96,
    DCmpL = 0x97,
    DCmpG = 0x98,
    IfEq = 0x99,
    IfNe = 0x9A,
    IfLt = 0x9B,
    IfGe = 0x9C,
    IfGt = 0x9D,
    IfLe = 0x9E,
    IfICmpEq = 0x9F,
    IfICmpNe = 0xA0,
    IfICmpLt = 0xA1,
    IfICmpGe = 0xA2,
    IfICmpGt = 0xA3,
    IfICmpLe = 0xA4,
    IfACmpEq = 0xA5,
    IfACmpNe = 0xA6,
    Goto = 0xA7,
    JSR = 0xA8,
    Ret = 0xA9,
    TableSwitch = 0xAA,
    LookupSwitch = 0xAB,
    IReturn = 0xAC,
    LReturn = 0xAD,
    FReturn = 0xAE,
    DReturn = 0xAF,
    AReturn = 0xB0,
    Return = 0xB1,
    GetStatic = 0xB2,
    PutStatic = 0xB3,
    GetField = 0xB4,
    PutField = 0xB5,
    InvokeVirtual = 0xB6,
    InvokeSpecial = 0xB7,
    InvokeStatic = 0xB8,
    InvokeInterface = 0xB9,
    InvokeDynamic = 0xBA,
    New = 0xBB,
    NewArray = 0xBC,
    ANewArray = 0xBD,
    ArrayLength = 0xBE,
    AThrow = 0xBF,
    CheckCast = 0xC0,
    InstanceOf = 0xC1,
    MonitorEnter = 0xC2,
    MonitorExit = 0xC3,
    Wide = 0xC4,
    MultiANewArray = 0xC5,
    IfNull = 0xC6,
    IfNonNull = 0xC7,
    Goto_W = 0xC8,
    JSR_W = 0xC9
}

export function getIConstByValue(value: number): Instructions {
    switch (value) {
        case -1:
            return Instructions.IConstM1;
        case 0:
            return Instructions.IConst0;
        case 1:
            return Instructions.IConst1;
        case 2:
            return Instructions.IConst2;
        case 3:
            return Instructions.IConst3;
        case 4:
            return Instructions.IConst4;
        case 5:
            return Instructions.IConst5;
        default:
            return value >= -128 && value <= 127 ? Instructions.BIPush : Instructions.SIPush;
    }
}

export function getIStoreByIndex(index: number): Instructions {
    switch (index) {
        case 0:
            return Instructions.IStore0;
        case 1:
            return Instructions.IStore1;
        case 2:
            return Instructions.IStore2;
        case 3:
            return Instructions.IStore3;
        default:
            return Instructions.IStore;
    }
}

export function getILoadByIndex(index: number): Instructions {
    switch (index) {
        case 0:
            return Instructions.ILoad0;
        case 1:
            return Instructions.ILoad1;
        case 2:
            return Instructions.ILoad2;
        case 3:
            return Instructions.ILoad3;
        default:
            return Instructions.ILoad;
    }
}