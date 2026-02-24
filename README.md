# POS — Point of Sale Application

## Tech Stack

| Layer      | Technology                         |
| ---------- | ---------------------------------- |
| Framework  | React Native (Expo ~54)            |
| Language   | JavaScript (JSX)                   |
| Navigation | React Navigation v7 (Native Stack) |
| Icons      | react-native-vector-icons (Expo)   |
| Platform   | Android / iOS                      |

---

## Project Structure

```
POS/
├── screens/
│   ├── HomeScreen.js          # Amount entry + payment method selection
│   ├── PaymentScreen.js       # Card payment flow
│   ├── QRPaymentScreen.js     # QR code generation & polling
│   ├── ResultScreen.js        # Payment success / failure result
│   └── TransactionsScreen.js  # Recent sales history
├── utils/
│   └── constants.js           # Shared config (API URL, machine ID, modes)
├── App.js                     # Navigation setup
├── app.json                   # Expo configuration
└── index.js                   # Entry point
```

---

## Getting Started

### Prerequisites

- Node.js >= 18
- Expo CLI use `npx expo`
- Expo Go app on your device **or** an Android

### Installation

```bash
npm install
```

### Configuration

Open `utils/constants.js` and update the following:

```js
export const MACHINE_ID = "<Your Machine ObjectId from DB>";
export const API_URL = "http://<your-local-ipv4-address>:5000/api";
```

> **Note:** Use your machine's local IP address (not `localhost`) so that a physical device can reach the backend server.

### Run the App

```bash
# Start Expo dev server
npx expo start

# Run on Android
Scan the QR code using Expo Go app

```

> **Note:** Make sure your machine and phone are on the same network.

---

## Simulation Modes

Controlled from the **HomeScreen** via the toggle pill in the top-left corner.

| Mode    | Token Sent      | Expected Outcome |
| ------- | --------------- | ---------------- |
| Valid   | `success_token` | Payment Approved |
| Invalid | `fail_token`    | Payment Declined |

The token is passed through navigation params to the payment screens and sent to the backend with the payment request.

---
