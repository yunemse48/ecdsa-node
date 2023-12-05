import { initialiseWallet } from "./scripts/generate.js";
import express from "express"
import cors from "cors"
import expressWs from "express-ws"
import WebSocket from "ws"

//const express = require("express");
const app = express();
//const cors = require("cors");
const port = 3042;
const expressWsInstance = expressWs(app); // Attaching WebSocket functionality to Express

app.use(cors());
app.use(express.json());

const addresses = [];

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
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
    console.log("Balances(POST send/): " + JSON.stringify(balances, null, 2));

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