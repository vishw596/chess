/* eslint-disable no-case-declarations */
import { useEffect, useState } from "react";
import { Button } from "../components/Button";
import { ChessBoard } from "../components/ChessBoard";
import { useSocket } from "../hooks/useSocket";
import { Chess } from "chess.js";
//move together code repetition here!
export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";
export const Game = () => {
    //the useSocket Hook establishes the connection to the websocket server
    const socket = useSocket();
    const [chess, setChess] = useState(new Chess());
    const [board, setBoard] = useState(chess.board());
    const [started,setStarted] = useState(false);
    const [color,setColor] = useState<string|null>(null)
    //registering onmessage event if socket is not null
    useEffect(() => {
        if (!socket) return;
        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            switch (message.type) {
                case INIT_GAME:
                    setBoard(chess.board());
                    console.log("Game init");
                    setStarted(true)
                    setColor(message.payload.color)
                    break;
                case MOVE:
                    const move = message.payload;
                    chess.move(move);
                    setBoard(chess.board());
                    console.log("Move made");
                    break;
                case GAME_OVER:
                    console.log("Game Over!");
                    break;
            }
        };
    }, [socket]);
    if (!socket) return <div>Connecting...</div>;
    return (
        <div className="justify-center flex">
            <div className="pt-8 max-w-screen">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                    <div className="col-span-4 bg-red-300">
                        <ChessBoard chess={chess} setBoard={setBoard}socket={socket}board={board} color={color} />
                    </div>
                    <div className={`col-span-2  flex items-center justify-center`}>
                       { !started && <Button
                            onClick={() => {
                                socket.send(JSON.stringify({ type: INIT_GAME }));
                            }}>
                            Play Now!
                        </Button>}
                    </div>
                </div>
            </div>
        </div>
    );
};
