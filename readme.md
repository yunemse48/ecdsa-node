# Blockchain Node Simulator - ECDSA Node

This project is a blockchain node simulation showcasing virtual digital wallets, transactions, and basic blockchain node functionalities. It serves as a learning tool for understanding blockchain development, security, and related technologies.

## Overview

The ECDSA Node project provides a centralised environment where clients can interact with a simulated blockchain node, create virtual digital wallets, initiate transactions, and explore basic blockchain node functionalities. It incorporates concepts of Public Key Cryptography using Elliptic Curve Digital Signatures (ECDSA) to secure transactions.

### Key Features

- **Virtual Digital Wallets:** Implemented a concept of "virtual digital wallets" to simulate the creation of wallets, including private key generation, public key derivation, and address creation.

- **Transaction Lifecycle:** Created a complete transaction process, including building, hashing, signing, verifying, and recovering public keys.

- **Blockchain Explorer (Transaction History):** Enabled clients to view all virtual wallet addresses and transaction history, offering insights into the blockchain node's state.

- **APIs and WebSockets:** Developed new API endpoints for serving and retrieving data, enhancing client-server communication with WebSockets.

- **React and State Management:** Utilised React for the client-side application, focusing on state management and user interaction.

- **`ethereum-cryptography` Library:** Gained practical experience with the "ethereum-cryptography" library for cryptographic operations.
- All scripts in `/server/scripts/` have been created by me. 

### Demonstration


https://github.com/yunemse48/ecdsa-node/assets/60715607/5354bcff-1a8e-4ad0-b679-0ca89f0b401f



## Note

- This project does not aim to perfectly replicate real blockchain systems. It serves as an educational tool and a starting point for understanding blockchain node development.

- Private keys are stored on the server for simulation purposes. No sensitive data, including private keys, is sent to the server by end-users, ensuring a reasonable level of security.

- The project is open-ended and flexible, providing room for evolution and customisation.

## Technologies Used

- **JavaScript (Node.js & Express):** Used for server-side development.
- **React:** Employed for building the client-side application and managing state.
- **WebSockets:** Enhanced client-server communication with real-time updates.
- **`ethereum-cryptography` Library:** Leveraged for cryptographic operations.

## Acknowledgments

Special thanks to the original project contributors and the community for providing a foundation for this simulation.

## Getting Started
### Client

1. Navigate to the `/client` folder in your terminal.
2. Run `npm install` to install dependencies.
3. Run `npm run dev` to start the React application.
4. Access the app at [http://127.0.0.1:5173/](http://127.0.0.1:5173/).

### Server

1. Open a terminal within the `/server` folder.
2. Run `npm install` to install server dependencies.
3. Run `nodemon index --ignore virtual-wallet.json --ignore transaction-history.json` to start the server.
4. The application should connect to the default server port (3042) automatically.
