import { WebSocket, WebSocketServer } from "ws";
import { GameManager } from "./GameManager";
import { AuthUser } from "./auth.ts";

const wss = new WebSocketServer({ port: 8080 });
const gameManager = new GameManager()
wss.on("connection", (socket: WebSocket,request) => {
    console.log("Client connected");
    const cookies = request.headers.cookie?.split("; ")
    const token = cookies?.filter(x=>x.startsWith("auth_token"))[0]?.split("=")[1]
    const user = AuthUser(token as string,socket)
    gameManager.addUser(user)
    socket.on("close",()=>{
        gameManager.removeUser(socket)
    })
});

