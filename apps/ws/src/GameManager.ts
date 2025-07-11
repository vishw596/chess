import { WebSocket } from "ws";
import {
    EXIT_GAME,
    GAME_ADDED,
    GAME_ALERT,
    GAME_ENDED,
    GAME_JOINED,
    GAME_NOT_FOUND,
    INIT_GAME,
    JOIN_ROOM,
    MOVE,
} from "@repo/messages/client";
import { Game } from "./Game";
import { socketManager, User } from "./SocketManager";
import { client } from "@repo/db/client";
import { BLACK } from "chess.js";

export class GameManager {
    private games: Game[];
    private users: User[];
    private pendingGameId: string | null;
    constructor() {
        this.games = [];
        this.users = [];
        this.pendingGameId = null;
    }
    addUser(user: User) {
        this.users.push(user);
        this.addHandler(user);
    }
    removeUser(socket: WebSocket) {
        const user = this.users.find((user) => user.socket === socket);
        if (!user) {
            console.error("user not found");
            return;
        }
        this.users = this.users.filter((user) => user.socket !== socket);
        socketManager.removeUser(user);
    }
    removeGame(gameId: string) {
        console.log("game removed!");
        if(this.pendingGameId)
        {
            this.pendingGameId = null;
        }
        this.games = this.games.filter((game) => game.gameId !== gameId);
    }
    private addHandler(user: User) {
        const socket = user.socket;
        socket.on("message", async (data) => {
            const message = JSON.parse(data.toString());
            if (message.type === INIT_GAME) {
                if (this.pendingGameId) {
                    const game = this.games.find((game) => game.gameId === this.pendingGameId);
                    if (!game) {
                        console.error("pending game not found!");
                        return;
                    }
                    if (user.userId === game.player1UserId) {
                        socketManager.broadcast(
                            game.gameId,
                            JSON.stringify({
                                type: GAME_ALERT,
                                payload: {
                                    message: "Trying to connect with youself",
                                },
                            })
                        );
                        return;
                    }
                    socketManager.addUser(user, game.gameId);
                    await game.updateSecondPlayer(user.userId);
                    this.pendingGameId = null;
                } else {
                    const game = new Game(user.userId, null);
                    this.games.push(game);
                    this.pendingGameId = game.gameId;
                    socketManager.addUser(user, game.gameId);
                    socketManager.broadcast(
                        game.gameId,
                        JSON.stringify({
                            type: GAME_ADDED,
                            gameId: game.gameId,
                        })
                    );
                }
            }
            if (message.type === MOVE) {
                const gameId = message.payload.gameId;
                const game = this.games.find((game) => game.gameId === gameId);
                if (game) {
                    game.makeMove(user, message.payload.move);
                    if (game.result) {
                        this.removeGame(gameId);
                    }
                }
            }
            if (message.type == EXIT_GAME) {
                const gameId = message.payload.gameId;
                const game = this.games.find((game) => game.gameId === gameId);
                if (game) {
                    game.exitGame(user);
                    this.removeGame(game.gameId);
                }
            }
            if (message.type === JOIN_ROOM) {
                const gameId = message.payload.gameId;
                if (!gameId) return;
                let availableGame = this.games.find((game) => game.gameId === gameId);
                const gameFromDb = await client.game.findUnique({
                    where: {
                        id: gameId,
                    },
                    include: {
                        moves: {
                            orderBy: {
                                moveNumber: "asc",
                            },
                        },
                        blackPlayer: true,
                        whitePlayer: true,
                    },
                });

                if (availableGame && !availableGame.player2UserId) {
                    socketManager.addUser(user, availableGame.gameId);
                    await availableGame.updateSecondPlayer(user.userId);
                    return;
                }

                if (!gameFromDb) {
                    user.socket.send(
                        JSON.stringify({
                            type: GAME_NOT_FOUND,
                        })
                    );
                    return;
                }

                if (gameFromDb.status !== "IN_PROGRESS") {
                    user.socket.send(
                        JSON.stringify({
                            type: GAME_ENDED,
                            payload: {
                                result: gameFromDb.result,
                                moves: gameFromDb.moves,
                                status: gameFromDb.status,
                                blackPlayer: {
                                    id: gameFromDb.blackPlayer.id,
                                    name: gameFromDb.blackPlayer.name,
                                },
                                whitePlayer: {
                                    id: gameFromDb.whitePlayer.id,
                                    name: gameFromDb.whitePlayer.name,
                                },
                            },
                        })
                    );
                    return;
                }

                if (!availableGame) {
                    const game = new Game(
                        gameFromDb.whitePlayer.id,
                        gameFromDb.blackPlayer.id,
                        gameFromDb.startAt,
                        gameFromDb.id
                    );
                    game.seedMoves(gameFromDb.moves || []);
                    this.games.push(game);
                    availableGame = game;
                }

                user.socket.send(
                    JSON.stringify({
                        type: GAME_JOINED,
                        payload: {
                            gameId,
                            moves: gameFromDb.moves,
                            blackPlayer: {
                                id: gameFromDb.blackPlayer.id,
                                name: gameFromDb.blackPlayer.name,
                            },
                            whitePlayer: {
                                id: gameFromDb.whitePlayer.id,
                                name: gameFromDb.whitePlayer.name,
                            },
                            player1TimeConsumed: availableGame.getPlayer1TimeConsumed(),
                            player2TimeConsumed: availableGame.getPlayer2TimeConsumed(),
                        },
                    })
                );
                socketManager.addUser(user, gameId);
            }
        });
    }
}
