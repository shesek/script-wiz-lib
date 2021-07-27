import WizData from "../convertion";
export declare const toAltStack: () => void;
export declare const fromAltStack: (wizData: WizData) => WizData;
export declare const twoDrop: () => void;
export declare const twoDup: (wizData: WizData, wizData2: WizData) => WizData[];
export declare const threeDup: (wizData: WizData, wizData2: WizData, wizData3: WizData) => WizData[];
export declare const twoOver: (wizData: WizData, wizData2: WizData) => WizData[];
export declare const rot: (wizData: WizData, wizData2: WizData, wizData3: WizData) => WizData[];
export declare const twoRot: (wizData: WizData, wizData2: WizData, wizData3: WizData, wizData4: WizData, wizData5: WizData, wizData6: WizData) => WizData[];
export declare const twoSwap: (wizData: WizData, wizData2: WizData, wizData3: WizData, wizData4: WizData) => WizData[];
export declare const depth: (length: number) => WizData;
export declare const drop: () => never[];
export declare const dup: (wizData: WizData) => WizData;
export declare const ifDup: (wizData: WizData) => WizData | {};
export declare const nip: (wizData: WizData) => WizData;
export declare const over: (wizData: WizData) => WizData;
export declare const pick: (wizDataArray: WizData[], stackIndex: number) => WizData[];
export declare const roll: (wizDataArray: WizData[], stackIndex: number) => WizData[];
export declare const swap: (wizData: WizData, wizData2: WizData) => WizData[];
export declare const tuck: (wizData: WizData, wizData2: WizData) => WizData[];
