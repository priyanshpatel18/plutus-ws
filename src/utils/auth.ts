import jwt from "jsonwebtoken";
import { WebSocket } from "ws";
import { User } from "../services/SocketManager";

const SECRET_KEY = process.env.SECRET_KEY || "my_secret_key";

export interface userJWT {
  userId: string;
  email: string;
  name: string;
}

export const extractAuthUser = (token: string, ws: WebSocket): User => {
  const decoded = jwt.verify(token, SECRET_KEY!) as userJWT;
  
  return new User(ws, decoded);
};
