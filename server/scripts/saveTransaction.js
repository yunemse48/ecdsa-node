import * as fs from "fs";

const FILE = "transaction-history.json"

export function saveTransaction(signedTransaction, hexHash) {
    const data = {[hexHash]: signedTransaction};
    console.log("Signed transaction: " + signedTransaction);
    console.log("Hash: " + hexHash);
    console.log(data);
    const JSONstring = JSON.stringify(data);

    fs.writeFileSync(FILE, JSONstring, (error) => {
        if (error) {
          console.error(error);
          throw error;
        }
        console.log("Transaction saved successfully!");
      });
}