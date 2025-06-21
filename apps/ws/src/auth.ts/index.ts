import jwt from "jsonwebtoken";
import { User } from "../SocketManager";
import { WebSocket } from "ws";
const JWT_SECRET = "ssX8mMvniuRmNGtfeZGIaBk8AUSgb0kycekX8tx0VCE";
export type jwtUser = {
    user: {
        id: string;
        email: string;
        name: string;
        auth_provider: string;
    };
};
export function AuthUser(token: string, ws: WebSocket) {
    const {user}: jwtUser = jwt.verify(token, JWT_SECRET) as jwtUser;
    console.log(user);

    if (user.auth_provider == "GUEST") return new User(ws, user.id, user.name, true);
    return new User(ws, user.id, user.name);
}
