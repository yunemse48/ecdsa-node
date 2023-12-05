import server from "./server";

function Wallet({ address, setAddress, balance, setBalance }) {
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
  
  async function fetchInitialAddresses() {
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
  }

  fetchInitialAddresses();

  return (
    <>
      <div className="Initialised Wallets">
        <h1>Wallet Addresses</h1>
        <ul id="list">
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
