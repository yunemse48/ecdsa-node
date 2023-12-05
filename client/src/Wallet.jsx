import server from "./server";
import React, { useState, useEffect } from "react";

function Wallet({ address, setAddress, balance, setBalance }) {
  const [initialAddresses, setInitialAddresses] = useState([]);
  const [conditionMet, setConditionMet] = useState(false);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:3042/websocket');

    socket.onopen = () => {
      console.log('WebSocket connection opened');
    };

    // Handle messages from the server
    socket.addEventListener('message', (event) => {
      console.log("Message received: " + event.data);
      const data = JSON.parse(event.data);
      if (data.type === 'conditionMet') {
        // Update state when condition is met
        setConditionMet(true);
        console.log("Set it TRUE");
      }
    });

    /*socket.onmessage = (event) => {
      console.log("Message received: " + event.data);
      const data = JSON.parse(event.data);
      if (data.type === 'conditionMet') {
        // Update state when condition is met
        setConditionMet(true);
        console.log("Set it TRUE");
      }
    };*/

    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      socket.close(); // Close the WebSocket connection on component unmount
    };
  }, []); // Empty dependency array to run once on mount

  useEffect(() => {
    console.log("Inside!");
    const fetchAddresses = async () => {
      try {
        const response = await server.get("initialAddresses");
        const { keys } = response.data;

        setInitialAddresses(keys);
        console.log("Fetch Addresses: " + keys);
      } catch (error) {
        console.error("Error fetching initial addresses:", error);
      }
    };
    fetchAddresses();
    setConditionMet(false);
    console.log("Set it FALSE");
  }, [conditionMet]);

  useEffect(() => {
    // Fetch initial addresses when the component mounts
    fetchInitialAddresses();
  }, []);

  const fetchInitialAddresses = async () => {
    try {
      const response = await server.get("initialAddresses");
      const { keys } = response.data;

      setInitialAddresses(keys);
      console.log("Fetch Initial Addresses: " + keys);
    } catch (error) {
      console.error("Error fetching initial addresses:", error);
    }
  };

  async function onChange(evt) {
    const address = evt.target.value;
    setAddress(address);
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }
  
  /*async function fetchInitialAddresses() {
    try {
      const response = await fetch("http://localhost:3042/initialAddresses");
      const data = await response.json();
      const addresses = data.addresses;
      console.log(addresses);
      const list = document.querySelector('#list');
      let li = [];
      
      for (let i = 0; i < addresses.length; i++) {
        li[i] = document.createElement('li');
        li[i].textContent = addresses[i];
      }
      
      li.forEach((element) => list.appendChild(element));


      //return addresses;
    } catch (error) {
      console.error("Error fetching initial addresses:", error);
    }
  }*/

  //fetchInitialAddresses();

  return (
    <>
      <div className="Initialised Wallets">
        <h1>Wallet Addresses</h1>
        <ul id="list">
          {initialAddresses.map((address, index) => (
            <li key={index}>{address}</li>
          ))}
        </ul>
      </div>

      <div className="container wallet">
        <h1>Your Wallet</h1>

        <label>
          Wallet Address
          <input placeholder="Type an address" value={address} onChange={onChange}></input>
        </label>

        <div className="balance">Balance: {balance}</div>
      </div>
    </>
  );
}

export default Wallet;
