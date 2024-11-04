import "dotenv/config";
import { WebSocket } from "ws";
import { HEARTBEAT, UPDATE_USER } from "../messages";
import { userJWT } from "../utils/auth";

export class User {
  public socket: WebSocket;
  public userId: string;
  public name: string;
  public email: string;

  constructor(socket: WebSocket, user: userJWT) {
    this.socket = socket;
    this.userId = user.userId;
    this.name = user.name;
    this.email = user.email;
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

  // User
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

      if (message.type === HEARTBEAT) {
        user.socket.send(JSON.stringify({ type: HEARTBEAT }));
      }
    });
  }

  sendMessage(payload: any, userId: string) {
    const user = this.users.find((u) => u.userId === userId);
    if (user) {
      user.socket.send(JSON.stringify({ type: UPDATE_USER, payload }));
    }
  }
}

export default SocketManager.getInstance();
