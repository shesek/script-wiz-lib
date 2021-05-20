import { MAX_INTEGER } from "../constant";
import { bytesToHex } from "./bytes";
import { hexToBytes } from "./hex";
import { numberToBytes } from "./number";

class Data {
  bytes: Uint8Array;
  hex: string;

  number?: number;
  text?: string;

  private constructor(hex?: string, number?: number, text?: string) {
    let bytesVal: Uint8Array = new Uint8Array([]);
    let hexVal: string = "";

    let numberVal: number | undefined = undefined;

    // fromHex
    if (hex !== undefined) {
      bytesVal = hexToBytes(hex);
      hexVal = hex;
    }

    // fromNumber
    else if (number !== undefined) {
      bytesVal = numberToBytes(number);
      hexVal = bytesToHex(bytesVal);
      numberVal = number;
    }

    // fromText
    else if (text !== undefined) {
      bytesVal = stringToBytes(text);
      hexVal = bytesToHex(bytesVal);
      this.text = text;
    }

    // set props
    this.bytes = bytesVal;
    this.hex = hexVal;
    if (numberVal !== undefined && -MAX_INTEGER <= numberVal && numberVal <= MAX_INTEGER) this.number = numberVal;
  }

  public static fromHex(hex: string): Data {
    return new Data(hex, undefined, undefined);
  }

  public static fromNumber(number: number): Data {
    return new Data(undefined, number, undefined);
  }

  public static fromText(text: string): Data {
    return new Data(undefined, undefined, text);
  }
}

export default Data;