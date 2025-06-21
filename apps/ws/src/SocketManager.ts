import { randomUUID } from "crypto";
import { WebSocket } from "ws";

export class User {
    public socket: WebSocket;
    public userId: string;
    public id: string;
    public name: string;
    public isGuest?: boolean;
    constructor(socket: WebSocket, userId: string, name: string,isGuest?:boolean) {
        this.socket = socket;
        this.userId = userId;
        this.id = randomUUID()
        this.name = name
        this.isGuest = isGuest
    }
}
