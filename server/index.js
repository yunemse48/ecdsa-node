import { initialiseWallet } from "./scripts/generate.js";
import { readWallet } from "./scripts/virtualWalletRead.js";
import { writeWallet } from "./scripts/virtualWalletWrite.js";
import { createTransaction } from "./scripts/createTransaction.js";
import express from "express"
import cors from "cors"
import expressWs from "express-ws"
import WebSocket from "ws"
import { recoverPubKey } from "./scripts/recoverPubKey.js";
import { signTransaction } from "./scripts/signTransaction.js";
import { saveTransaction } from "./scripts/saveTransaction.js";
import { verifySignature } from "./scripts/verifySignature.js";
import { readTransactions } from "./scripts/readTransactions.js";

//const express = require("express");
const app = express();
//const cors = require("cors");
const port = 3042;
const expressWsInstance = expressWs(app); // Attaching WebSocket functionality to Express

app.use(cors());
app.use(express.json());

export let totalTransactions = 0;
const addresses = [];
const transactions = {};

for (let i = 0; i < 3; i++) {
  addresses.push(initialiseWallet());
}

const balances = {
  [addresses[0]]: 100,
  [addresses[1]]: 50,
  [addresses[2]]: 75,
};

const prevBalances = JSON.parse(JSON.stringify(balances));
console.log("prevBalances: " + JSON.stringify(prevBalances, null, 2));
console.log(Object.keys(prevBalances).length);

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  }
  else if (recipient === sender) {
    res.status(400).send({ message: "Sender and recipient cannot be the same!" });
  } 
  else {
    const data = readWallet();
    console.log("File read: " + JSON.stringify(data));
    // if the sender has a privKey in virtual wallet, call signTransaction function
    // verify the transaction signature, if verified continue and increment the nonce by 1
    if ( sender in data ) {
      if ( data[sender].privateKey !== null ) {
        let isSigned = false;
        const rawTransaction = createTransaction(sender, recipient, amount, data[sender].nonce);
        const tx_sign_hash = signTransaction(data[sender].privateKey, rawTransaction);
        const signedTransaction = tx_sign_hash[0];
        const signature = tx_sign_hash[1];
        const hash = tx_sign_hash[2];
        const hexHash = tx_sign_hash[3];
        const recoveredPubKey = recoverPubKey(signature, hash);
        isSigned = verifySignature(signature, hash, recoveredPubKey);
        
        if (isSigned) {
          console.log("Signature verified!");
          // process the transfer
          balances[sender] -= amount;
          balances[recipient] += amount;

          // add the recipient address to loca wallet object with nonce = 0 if not existing
          if (!(recipient in data)) {
            data[recipient] = {privateKey: null, publicKey: null, nonce: 0};
            //writeWallet(JSON.stringify(data));
          }
          
          // increment sender nonce by 1
          data[sender].nonce += 1;
          console.log("Nonce incremented by 1");

          // update the virtual wallet
          writeWallet(JSON.stringify(data, null, 4));

          // save the signed transaction
          saveTransaction(signedTransaction, hexHash);
          Object.assign(transactions, readTransactions());
          totalTransactions += 1;

          const txHash = hexHash;
          const compactHexSignature = tx_sign_hash[4];
          const tx = JSON.stringify(signedTransaction, undefined, 4); 

          res.send({ balance: balances[sender], message: "TRANSACTION DETAILS" + "\n--------------" +
                                                        "\n\nTX Hash: " + txHash + 
                                                        "\n\nSignature: " + compactHexSignature + 
                                                        "\n\nTransaction: " + tx});
          //res.status(200).send({ message: "Success!" });
          console.log("Balances(POST send/): " + JSON.stringify(balances, null, 2));

        }
          // process transaction
          // update balances
          // update nonce
          // update wallet
          // update totalTransactions count
          // store transaction in transaction-history.json

      }
      else {
        res.status(400).send({ message: "This address is not authorised to make a transaction!\nNO PRIVATE KEY!" });
      }
    }
    else {
      data[sender] = {privateKey: null, publicKey: null, nonce: 0};
      writeWallet(JSON.stringify(data));
      res.status(400).send({ message: "This address is not authorised to make a transaction!\nSender is not in the wallet.\nNO PRIVATE KEY!" });
    }
    
    

    expressWsInstance.getWss().clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        console.log(Object.keys(prevBalances).length !== Object.keys(balances).length);
        if (Object.keys(prevBalances).length !== Object.keys(balances).length) {
          // Send a message to the client
          console.log("Object lengths are different!");
          client.send(JSON.stringify({ type: 'conditionMet', data: 'Change state' }));
      }
    }});

  }
});

app.get("/initialAddresses", (req, res) => {
  res.json({ keys: Object.keys(balances) });
});

app.get("/transactionHistory", (req, res) => {
    res.json({ transactions });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}

// WebSocket route
app.ws('/websocket', (ws, req) => {
  console.log('WebSocket connection opened');
  /*console.log(Object.keys(prevBalances).length !== Object.keys(balances).length);
  if (Object.keys(prevBalances).length !== Object.keys(balances).length) {
    // Send a message to the client
    console.log("Object lengths are different!");
    ws.send(JSON.stringify({ type: 'conditionMet', data: 'Change state' }));
  }*/

  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });
});