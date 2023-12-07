import * as fs from "fs";

const WALLET_FILE = "virtual-wallet.json";

export function writeWallet(data) {
    fs.writeFileSync(WALLET_FILE, data, (error) => {
        if (error) {
          console.error(error);
          throw error;
        }
      
        console.log("Wallet file written correctly.");
      });
}