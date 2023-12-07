import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { toHex } from "ethereum-cryptography/utils";

export function recoverPubKey(signature, hash) {
    const pubKey = signature.recoverPublicKey(hash);
    const hexPubKey = pubKey.toHex(false)
    console.log("Recovered Public Key:" + pubKey.toHex(false));
    console.log("x:", pubKey.x.toString());
    console.log("y:", pubKey.y.toString());
    return hexPubKey;
}