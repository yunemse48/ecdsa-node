import { useState } from "react";
import server from "./server";

function Transfer({ address, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  //const [transactions, setTransactions] = useState({});

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    try {
      const {
        data: { balance, message },
      } = await server.post(`send`, {
        sender: address,
        amount: parseInt(sendAmount),
        recipient,
      });
      setBalance(balance);
      alert(message);

      const response = await server.get("transactionHistory");
      const { transactions } = response.data;
      //setTransactions(transactions);
      alert("TRANSACTION HISTORY\n" + "--------------\n" + JSON.stringify(transactions, null, 4));

    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <div>
      <form className="container transfer" onSubmit={transfer}>
        <h1>Send Transaction</h1>

        <label>
          Send Amount
          <input
            placeholder="1, 2, 3..."
            value={sendAmount}
            onChange={setValue(setSendAmount)}
          ></input>
        </label>

        <label>
          Recipient
          <input
            placeholder="Type an address, for example: 0x2"
            value={recipient}
            onChange={setValue(setRecipient)}
          ></input>
        </label>

        <input type="submit" className="button" value="Transfer" />
      </form>
    </div>
  );
}

export default Transfer;
