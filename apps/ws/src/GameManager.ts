import { WebSocket } from "ws";
import { INIT_GAME, MOVE } from "./message";
import { Game } from "./Game";
import { User } from "./SocketManager";

export class GameManager {
    private games: Game[];
    private users: User[];
    private pendingUser: WebSocket | null;
    constructor() {
        this.games = [];
        this.users = [];
        this.pendingUser = null;
    }
    addUser(user:User) {
        this.users.push(user);
        this.addHandler(user);
    }
    removeUser(socket: WebSocket) {
        this.users = this.users.filter((user) => user.socket !== socket);
    }
    private addHandler(user: User) {
        const socket = user.socket
        socket.on("message", (data) => {
            const message = JSON.parse(data.toString());
            if (message.type === INIT_GAME) {
                this.initGame(socket);
            }
            if (message.type === MOVE) {
                const game = this.games.find((el) => el.player1 === socket || el.player2 === socket )
                if(game){
                    game.makeMove(socket,message.payload.move)
                }
            }
        });
    }
    private initGame(socket: WebSocket) {
        if (this.pendingUser) {
            //create the game
            const newGame = new Game(this.pendingUser, socket);
            console.log("New Game is created");
            
            this.games.push(newGame);
            this.pendingUser = null;
        } else {
            //add user to the pendingUser
            this.pendingUser = socket;
        }
    }
}
