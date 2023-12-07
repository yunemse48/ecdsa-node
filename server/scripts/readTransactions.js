import * as fs from "fs";

const FILE = "transaction-history.json";

export function readTransactions() {
    const jsonData = fs.readFileSync(FILE);
    const data = JSON.parse(jsonData);
    return data;
}