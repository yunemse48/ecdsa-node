import { secp256k1 } from "ethereum-cryptography/secp256k1";

export function verifySignature(signature, hash, recoveredPubKey) {
    console.log("Verifying the signature: " + secp256k1.verify(signature, hash, recoveredPubKey));
    return secp256k1.verify(signature, hash, recoveredPubKey);
}