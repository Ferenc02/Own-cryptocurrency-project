# A Decentralized Cryptocurrency Project

A fully functional blockchain application built with Node.js, WebSockets, MongoDB, and a secure authentication layer using JWT. This project simulates a decentralized cryptocurrency network with multiple nodes, transaction validation, and mining functionality.

---

## 📌 Features

### 🔗 Blockchain & Cryptocurrency

- Fully implemented blockchain from scratch
- Genesis block initialization
- Mining functionality with **reward transactions**
- Real-time **transaction pool** handling
- **Proof-of-Work** consensus mechanism
- Each node has a unique wallet address and balance

### 🌐 Peer-to-Peer Network

- P2P node communication using **WebSockets**
- Master server that tracks all connected peers
- Automatic blockchain syncing:
  - On node startup
  - On transaction broadcast
  - On block creation

### 🔐 User Authentication

- Secure **JWT**-based login/register
- Password hashing with bcrypt
- Role-based access control for:
  - Viewing own transactions and blocks
  - Creating new transactions
- MongoDB-based user storage

### 🧪 Testing & Architecture

- Test-Driven Development (TDD) with `blockchain.test.js`
- Modular architecture following **MVC** and **Separation of Concerns**
- Defensive coding against **NoSQL injection**, **XSS**, and **basic DDOS**

### 🖥️ Frontend (Client)

- Plain HTML/CSS/JS
- Glassmorphism-inspired **dark futuristic design**
- Create new transactions via UI
- View mined blocks and pending transactions
- Send mining request through UI
- Responsive layout for multiple devices

---

## 🛠️ Technologies Used

- Node.js
- WebSocket (WS)
- MongoDB & Mongoose
- Express
- JWT (jsonwebtoken)
- Bcrypt
- HTML / CSS / Vanilla JavaScript
- dotenv, helmet, express-rate-limit, cors

---

## 📂 Folder/Files Structure

```plaintext

src
├── backend (Backend for the web app)
│   ├── auth
│   ├── controllers
│   ├── database
│   ├── middlewares
│   ├── routes
│
├── blockchain (Almost the same as first project)
│   ├── controllers
│   ├── database
│   ├── middlewares
│   ├── models
│   ├── routes
│   ├── services
│   ├── tests
│
├── misc (Ipgrabber, used to get your local ipv4 address)
│
├── node (The brain of the p2p and master server)
│
├── public (Frontend for the web app)
│   ├── images
│   ├── js
│   ├── static
│   ├── style

```

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Ferenc02/Own-cryptocurrency-project
cd Own-cryptocurrency-project
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Change the `.env` and set your environment variables:

```plaintext
NODE_MASTER_SERVER_URL=(Your local ipv4 address)
NODE_MASTER_SERVER_PORT=8080
JWT_SECRET=424c6e997f3a21017769f113168b672af39323fe3688c9982a42e7c255965edd
```

If you don't know your local ipv4 address, you can find it and save it to .env by running:

```bash
npm run dev:ip
```

### 4. Setup MongoDB connection and create a database named `db` with collection `users` and `blockchain`:

```plaintext
mongodb://127.0.0.1:27017/db/
mongodb://127.0.0.1:27017/db/users
mongodb://127.0.0.1:27017/db/blockchain

```

### 5. Start Servers

Start the **master server**:

```bash
npm run dev:master
```

Start a **P2P node** with a random port (you can start as many nodes as you want):

```bash
npm run dev:node
```

Start the **web backend (API)**:

```bash
npm run dev:backend
```

start the **web frontend**:

```bash
npm run dev:web
```

---

## Architecture

To understand the architecture, refer to the [Architecture.txt](./Architecture.txt) file.
