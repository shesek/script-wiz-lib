import { hexLittleEndian } from "./helper";

const cropTwo = (hex: string): string => hex.substring(2);

const toLEPadByte = (number: number) => {
  const hex = number.toString(16);
  const padHex = hex.length % 2 === 0 ? hex : "0" + hex;
  return cropTwo(hexLittleEndian(padHex));
};

const compileData = (hex: string): string => {
  const byteLength = hex.length / 2 - 1;

  // 0byte
  if (byteLength === 0) {
    return "00";
  }

  // 1 byte
  else if (byteLength === 1) {
    const n = parseInt(hex, 16);
    if (0 < n && n < 17) {
      return (n + 80).toString(16);
    } else {
      return "01" + cropTwo(hex);
    }
  }

  // 1 < byte <= 75
  else if (1 < byteLength && byteLength <= 75) {
    return toLEPadByte(byteLength) + cropTwo(hex);
  }

  // 76 < byte <= 255
  else if (76 < byteLength && byteLength <= 255) {
    return "4c" + toLEPadByte(byteLength) + cropTwo(hex);
  }

  // 256 < byte <= 520
  else if (256 < byteLength && byteLength <= 520) {
    return "4d" + toLEPadByte(byteLength) + cropTwo(hex);
  }

  // 520 < byte
  else {
    throw "compileAll: Push exceeds the push size limit of 520 bytes.";
  }
};

const compileJoin = (hexes: string[]): string => "0x" + hexes.join("");

export { cropTwo, compileData, compileJoin };
