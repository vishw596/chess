import type { Chess, Color, PieceSymbol, Square } from "chess.js";
import { MOVE } from "../pages/Game";
import { useState } from "react";

export const ChessBoard = ({
    board,
    socket,
    setBoard,
    chess,
    color
}: {
    board: ({
        square: Square;
        type: PieceSymbol;
        color: Color;
    } | null)[][];
    socket: WebSocket;
    chess: Chess;
    setBoard: any;
    color:string|null
}) => {
    const [from, setFrom] = useState<Square | null>(null);
    const [to, setTo] = useState<Square | null>(null);
    return (
        <div className="w-full">
            {board.map((row, i) => {
                return (
                    <div key={i} className="flex">
                        {row.map((square, j) => {
                            const squareRepresentation = (String.fromCharCode(97 + (j % 8)) + "" + (8 - i)) as Square;
                            return (
                                <div
                                    onClick={() => {
                                        if (!from) {
                                            if (square) {
                                                if (chess.history().length % 2 == 1 && color != "b") return;
                                                if (chess.history().length % 2 == 0 && color != "w") return;
                                                setFrom(squareRepresentation);
                                            }
                                        } else {
                                            socket.send(
                                                JSON.stringify({
                                                    type: MOVE,
                                                    payload: {
                                                        move: {
                                                            from,
                                                            to: squareRepresentation,
                                                        },
                                                    },
                                                })
                                            );
                                            setFrom(null);
                                            chess.move({
                                                from,
                                                to: squareRepresentation,
                                            });
                                            setBoard(chess.board());
                                            console.log(from, to);
                                        }
                                    }}
                                    key={j}
                                    className={`w-20 h-20 ${(i + j) % 2 === 0 ? "bg-green-500" : "bg-green-200"} `}>
                                    <div className="justify-center flex w-full h-full items-center">
                                        {square ? (
                                            <img
                                                className="w-[4.25rem]"
                                                src={`/${
                                                    square?.color === "b" ? `b${square.type}` : `w${square.type}`
                                                }.png`}
                                            />
                                        ) : null}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
};
