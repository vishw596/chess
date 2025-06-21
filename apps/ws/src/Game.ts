import { Chess } from "chess.js";
import { WebSocket, WebSocketEventMap } from "ws";
import { GAME_OVER, INIT_GAME, MOVE } from "./message";

export class Game {
    player1: WebSocket;
    player2: WebSocket;
    board: Chess;
    startTime: Date;
    constructor(player1: WebSocket, player2: WebSocket) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();
        this.startTime = new Date();
        this.player1.send(
            JSON.stringify({
                type: INIT_GAME,
                payload: {
                    color: "w",
                },
            })
        );
        this.player2.send(
            JSON.stringify({
                type: INIT_GAME,
                payload: {
                    color: "b",
                },
            })
        );
    }
    makeMove(
        socket: WebSocket,
        move: {
            from: string;
            to: string;
        }
    ) {
        
        // in chess white is the first move so if the move is even and the player is not white return
        if (this.board.history().length % 2 == 0 && this.player1 !== socket) return;
        // in chess black is the second move so if the move is odd and the player is not black return
        if (this.board.history().length % 2 == 1 && this.player2 !== socket) return;
        try {
            this.board.move(move);
        } catch (error) {
            console.log(error);
            return;
        }
        //GAME OVER LOGIC
        if (this.board.isGameOver()) {
            this.player1.send(
                JSON.stringify({
                    type: GAME_OVER,
                    payload: {
                        winner: this.board.turn() === "w" ? "black" : "white",
                    },
                })
            );
            this.player2.send(
                JSON.stringify({
                    type: GAME_OVER,
                    payload: {
                        winner: this.board.turn() === "w" ? "black" : "white",
                    },
                })
            );
        }
        //message sending logic 
        if (this.board.history().length % 2 == 1) {
            console.log("Message sent! to player 2");
            this.player2.send(
                JSON.stringify({
                    type: MOVE,
                    payload: move,
                })
            );
        }

        if (this.board.history().length % 2 == 0) {
            console.log("Message sent! to player 1");
            this.player1.send(
                JSON.stringify({
                    type: MOVE,
                    payload: move,
                })
            );
        }
    }
}
