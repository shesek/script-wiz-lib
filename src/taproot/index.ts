import WizData from "@script-wiz/wiz-data";
import { sha256 } from "../core/crypto";
import { toHexString } from "../utils";
import { commonOpcodes } from "../opcodes/common";
import { Taproot } from "./model";
import * as segwit_addr from "../bech32/segwit_addr";
import bcrypto from "bcrypto";
import { VM, VM_NETWORK } from "../opcodes/model/VM";

// type TreeHelper = {
//   data: string;
//   h: string;
// };

export const tweakAdd = (pubkey: WizData, tweak: WizData): WizData => {
  if (pubkey.bytes.length !== 32) {
    throw "Pubkey length must be equal 32 byte";
  }

  const tweaked = WizData.fromHex(bcrypto.schnorr.publicKeyTweakAdd(Buffer.from(pubkey.hex, "hex"), Buffer.from(tweak.hex, "hex")).toString("hex"));

  return publicKeyTweakCheck(pubkey, tweak, tweaked);
};

export const publicKeyTweakCheck = (pubkey: WizData, tweak: WizData, expect: WizData): WizData => {
  if (pubkey.bytes.length !== 32) {
    throw "Pubkey length must be equal 32 byte";
  }

  const isNegate = bcrypto.schnorr.publicKeyTweakCheck(Buffer.from(pubkey.hex, "hex"), Buffer.from(tweak.hex, "hex"), Buffer.from(expect.hex, "hex"), true);

  if (isNegate) {
    return WizData.fromHex("03" + expect.hex);
  }

  return WizData.fromHex("02" + expect.hex);
};

export const publicKeyTweakCheckWithPrefix = (pubkey: WizData, tweak: WizData, expect: WizData): boolean => {
  if (pubkey.bytes.length !== 32) {
    throw "Pubkey length must be equal 32 byte";
  }

  const expectKeyWithoutPrefix = expect.bytes.slice(1, expect.bytes.length);
  const expectKeyWithoutPrefixData = WizData.fromBytes(expectKeyWithoutPrefix);

  return bcrypto.schnorr.publicKeyTweakCheck(
    Buffer.from(pubkey.hex, "hex"),
    Buffer.from(tweak.hex, "hex"),
    Buffer.from(expectKeyWithoutPrefixData.hex, "hex"),
    expect.bytes[0] === 3
  );
};

export const tagHash = (tag: string, data: WizData) => {
  let hashedTag = sha256(WizData.fromText(tag)).toString();

  hashedTag = hashedTag.concat(hashedTag);

  hashedTag = hashedTag.concat(toHexString(data.bytes));

  return sha256(WizData.fromHex(hashedTag)).toString();
};

export const treeHelper = (scripts: WizData[], version: string): string => {
  let treeHelperResultHex = "";
  const leaftag = version === "c4" ? "TapLeaf/Elements" : "TapLeaf";
  const tapBranchtag = version === "c4" ? "TapBranch/Elements" : "TapBranch";

  scripts.forEach((script) => {
    const scriptLength = WizData.fromNumber(script.hex.length / 2).hex;

    const scriptData = version + scriptLength + script.hex;

    const h = tagHash(leaftag, WizData.fromHex(scriptData));

    treeHelperResultHex += h;
  });

  const tapBranchResult: string = tagHash(tapBranchtag, WizData.fromHex(treeHelperResultHex));

  return tapBranchResult;
};

// export const getVersionTaggedPubKey = (pubkey: WizData): WizData => {
//   const logic = pubkey.bytes[0] & 1;

//   console.log("logic", logic);
//   if (logic === 1) {
//     return WizData.fromHex("00");
//   }

//   return WizData.fromNumber(1);
// };

export const tapRoot = (pubKey: WizData, scripts: WizData[], vm: VM): Taproot => {
  const version = vm.network === VM_NETWORK.LIQUID ? "c4" : "c0";
  const tag = vm.network === VM_NETWORK.LIQUID ? "TapTweak/Elements" : "TapTweak";

  const h: string = treeHelper(scripts, version);

  console.log("tap leaf result", h);

  const tweak = tagHash(tag, WizData.fromHex(pubKey.hex + h));

  console.log("tap tweak result", tweak);

  const tweaked = tweakAdd(pubKey, WizData.fromHex(tweak));

  console.log("tap tweaked result:", tweaked.hex);

  const finalTweaked = tweaked.hex.substr(2);

  console.log("final tweaked", finalTweaked);

  const op1Hex = commonOpcodes.find((co) => co.word === "OP_1")?.hex.substr(2);

  const bech32 = segwit_addr.encode("bech32m", 1, WizData.fromHex(finalTweaked).bytes) || "";

  return { scriptPubKey: WizData.fromHex(op1Hex + WizData.fromNumber(finalTweaked.length / 2).hex + finalTweaked), tweak: tweaked, bech32 };
};
