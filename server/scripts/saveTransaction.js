import * as fs from "fs";
import { totalTransactions } from "../index.js";

const FILE = "transaction-history.json"

export function saveTransaction(signedTransaction, hexHash) {
  console.log("Total Transactions: " + totalTransactions);
  if ((!fs.existsSync(FILE)) || (totalTransactions === 0)) {
    const initObject = {};
    const initString = JSON.stringify(initObject, null, 4);
    fs.writeFileSync(FILE, initString, (error) => {
      if (error) {
        console.error(error);
        throw error;
      }
      console.log("Transaction history started.");
    });
  }

    const jsonReadData = fs.readFileSync(FILE);
    const readData = JSON.parse(jsonReadData);
    
    readData[hexHash] = signedTransaction;
    console.log("Signed transaction: " + JSON.stringify(signedTransaction));
    console.log("Hash: " + hexHash);
    const JSONstring = JSON.stringify(readData, null, 4);

    fs.writeFileSync(FILE, JSONstring, (error) => {
        if (error) {
          console.error(error);
          throw error;
        }
        console.log("Transaction saved successfully!");
      });
}