import { IOpWordCode } from "../constant/opWordCodes";
import { StackDataList } from "../model";
declare const hexLittleEndian: (hex: string) => string;
declare const opcodeToData: (word: string) => IOpWordCode | undefined;
declare const opcodeToWord: (opcode: number) => string;
declare const opWordToCode: (word: string) => number;
declare const opWordToHex: (word: string) => string;
declare const currentScope: (stackDataList: StackDataList) => boolean;
declare const checkByteValuesEquality: (byte1: string, byte2: string) => boolean;
export { hexLittleEndian, opcodeToWord, opcodeToData, opWordToCode, opWordToHex, currentScope, checkByteValuesEquality };
