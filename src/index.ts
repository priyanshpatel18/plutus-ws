import url from "url";
import { WebSocket, WebSocketServer } from "ws";
import { CONNECTED } from "./messages";
import socketManager from "./services/SocketManager";
import { extractAuthUser } from "./utils/auth";

const PORT: number = Number(process.env.PORT) || 8080;
const wss = new WebSocketServer({ port: PORT });

wss.on("connection", (ws: WebSocket, req) => {
  const parsedUrl = url.parse(req.url || "", true);
  const queryParams = parsedUrl.query;

  const token = queryParams.token;
  if (!token || typeof token !== "string") {
    ws.close(4001, "Token not provided");
    return;
  }

  const user = extractAuthUser(token, ws);
  socketManager.addUser(user);
  ws.send(JSON.stringify({ type: CONNECTED, payload: user.userId }));

  ws.on("close", () => {
    socketManager.removeUser(user);
  });
});

console.log(`LISTENING ON PORT ${PORT}`);
