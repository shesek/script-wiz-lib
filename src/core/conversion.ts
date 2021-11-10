import WizData from "@script-wiz/wiz-data";

export const numToLE64 = (wizData: WizData): WizData => {
  const inputByteLength = wizData.bytes.length;

  if (inputByteLength > 8) throw "Input byte length must be maximum 8 byte";

  if (inputByteLength < 8) {
    const emptyByte = 8 - inputByteLength;
    let i = 0;
    let additionalByte = "";

    while (i < emptyByte) {
      additionalByte += "00";
      i++;
    }

    return WizData.fromHex(wizData.hex + additionalByte);
  }

  return wizData;
};

export const LE64ToNum = (wizData: WizData): WizData => {
  const inputBytes = wizData.bytes;

  if (inputBytes.length !== 8) throw "Input byte length must be equal 8 byte";

  let resultHex = wizData.hex;

  let i = 7;

  while (i >= 0) {
    if (inputBytes[i] > 0) {
      break;
    }

    resultHex = resultHex.slice(0, -2);
    i--;
  }

  return WizData.fromHex(resultHex);
};