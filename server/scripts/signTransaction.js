import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { keccak256 } from "ethereum-cryptography/keccak";
import { utf8ToBytes } from "ethereum-cryptography/utils";
import { toHex } from "ethereum-cryptography/utils";

export function signTransaction(privateKey, rawTransaction) {
    const signedTransaction = {};
    const JSONstring = JSON.stringify(rawTransaction);
    const bytes = utf8ToBytes(JSONstring);
    const transactionHash = keccak256(bytes);
    const hexHash = toHex(transactionHash);
    const signature = secp256k1.sign(transactionHash, privateKey, {recovery: true});
    const compactHexSignature = signature.toCompactHex();
    console.log("SIGNATURE: " + compactHexSignature);
    console.log("r: " + signature.r + "\ns: " + signature.s + "\nRecovery: " + signature.recovery);
    
    Object.assign(signedTransaction, rawTransaction);

    return [signedTransaction, signature, transactionHash, hexHash, compactHexSignature];
}