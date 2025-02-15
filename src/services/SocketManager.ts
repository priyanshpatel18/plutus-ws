import "dotenv/config";
import { WebSocket } from "ws";
import { HEARTBEAT, PREDICTION } from "../messages";

export class User {
  public socket: WebSocket;

  constructor(socket: WebSocket) {
    this.socket = socket;
  }
}

class SocketManager {
  public static instance: SocketManager;
  private users: User[];

  constructor() {
    this.users = [];
  }

  public static getInstance(): SocketManager {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager();
    }
    return SocketManager.instance;
  }

  addUser(user: User) {
    this.users.push(user);
    this.userHandler(user);
  }
  removeUser(user: User) {
    this.users = this.users.filter((u) => u !== user);
  }
  private userHandler(user: User) {
    user.socket.on("message", (data: string) => {
      const message = JSON.parse(data.toString());
      console.log(message);
      

      if (message.type === HEARTBEAT) {
        user.socket.send(JSON.stringify({ type: HEARTBEAT }));
      }

      if (message.type === PREDICTION) {
        
      }
    });
  }
}

export default SocketManager.getInstance();
