import * as fs from "fs";

const WALLET_FILE = "virtual-wallet.json";

export function readWallet() {
    const jsonData = fs.readFileSync(WALLET_FILE);
    const data = JSON.parse(jsonData);
    return data;
}