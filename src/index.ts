import { Keypair } from "@solana/web3.js";
import { mnemonicToSeedSync } from "bip39";
import { derivePath } from "ed25519-hd-key";
import nacl from "tweetnacl";
import { WebSocket, WebSocketServer } from "ws";
import { CONNECTED } from "./messages";
import socketManager from "./services/SocketManager";

const PORT: number = Number(process.env.PORT) || 8080;
const wss = new WebSocketServer({ port: PORT });

const mnemonics = "zoo welcome dice immense skirt tower harsh minute spy author rebuild used";

const seedBuffer = mnemonicToSeedSync(mnemonics);
const path = `m/44'/501'/1'/1'`;
const { key: derivedSeed } = derivePath(path, seedBuffer.toString("hex"));

const { secretKey } = nacl.sign.keyPair.fromSeed(derivedSeed);
const keypair = Keypair.fromSecretKey(secretKey);

const PRIVATE_KEY = Buffer.from(keypair.secretKey).toString('hex');
const PUBLIC_KEY = keypair.publicKey.toBase58();

wss.on("connection", (ws: WebSocket, req) => {
  ws.send(JSON.stringify({ type: CONNECTED }));

  ws.on("close", () => {
    socketManager.removeUser({ socket: ws });
  });
});

console.log(`LISTENING ON PORT ${PORT}`);