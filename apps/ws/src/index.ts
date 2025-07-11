import { WebSocket, WebSocketServer } from "ws";
import { GameManager } from "./GameManager";
import { AuthUser } from "./auth/index";

const wss = new WebSocketServer({ port: 8080},() => console.log("Websocket server is listening on PORT 8080"));
const gameManager = new GameManager();
wss.on("connection", (socket: WebSocket, request) => {
    console.log("Client connected");
    const cookies = request.headers.cookie?.split("; ");
    const token = cookies?.filter((x) => x.startsWith("auth_token"))[0]?.split("=")[1];
    const user = AuthUser(token as string, socket);
    if (user) {
        gameManager.addUser(user);
        socket.on("close", () => {
            console.log("Client disconnected");
            gameManager.removeUser(socket);
        });
    }else
    {
        socket.send(JSON.stringify({
            type:"Unautorized"
        }))
        
    }
});
