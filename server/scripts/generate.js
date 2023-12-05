/*const {secp256k1} = require("ethereum-cryptography/secp256k1");
//const {getPublicKey} = require("ethereum-cryptography/secp256k1/getPublicKey");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { toHex } = require("ethereum-cryptography/utils/toHex");*/

import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { keccak256 } from "ethereum-cryptography/keccak";
import { toHex } from "ethereum-cryptography/utils";

export function initialiseWallet() {
    //const privateKey = randomPrivateKey();
    const privateKey = secp256k1.utils.randomPrivateKey();
    console.log("Private Key:" + toHex(privateKey));

    //const publicKey = getPublicKey(privateKey);
    const publicKey = secp256k1.getPublicKey(privateKey);
    console.log("Public Key:" + toHex(publicKey));

    const key = publicKey.slice(1);
    //console.log(toHex(key));

    const hashed = keccak256(key);
    const address = hashed.slice(-20);
    //console.log(address);

    const hexAddress = "0x" + toHex(address);
    console.log("Address:" + hexAddress);

    return hexAddress;
}

const addresses = [];

for (let i = 0; i < 3; i++) {
  addresses.push(initialiseWallet());
}

const balances = {
  [addresses[0]]: 100,
  [addresses[1]]: 50,
  [addresses[2]]: 75,
};

console.log(balances);
console.log([addresses[1]]);