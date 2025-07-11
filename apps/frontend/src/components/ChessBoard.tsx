import { Chess, Move, type Color, type PieceSymbol, type Square } from "chess.js";
import { MOVE } from "@repo/messages";
import { memo, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { isBoardFlippedAtom, movesAtom, userSelectedMoveIndexAtom } from "../store/atoms/chessBoard"
import { NumberNotation } from "./NumberNotation";
import ChessSquare from "./ChessSquare";
import LetterNotation from "./LetterNotation";
import LegalMoveIndicator from "./LegalMoveIndicator";
import MoveSound from '/move.wav'
import CaptureSound from '/capture.wav';
export function isPromoting(chess: Chess, from: Square, to: Square) {
    if (!from) {
        return false;
    }

    const piece = chess.get(from);

    if (piece?.type !== 'p') {
        return false;
    }

    if (piece.color !== chess.turn()) {
        return false;
    }

    if (!['1', '8'].some((it) => to.endsWith(it))) {
        return false;
    }

    return chess
        .history({ verbose: true })
        .map((it) => it.to)
        .includes(to);
}



export const ChessBoard = memo(
    ({
        gameId,
        started,
        myColor,
        chess,
        board,
        socket,
        setBoard,
    }: {
        myColor: Color;
        gameId: string;
        started: boolean;
        chess: Chess;
        setBoard: React.Dispatch<
            React.SetStateAction<
                ({
                    square: Square;
                    type: PieceSymbol;
                    color: Color;
                } | null)[][]
            >
        >;
        board: ({
            square: Square;
            type: PieceSymbol;
            color: Color;
        } | null)[][];
        socket: WebSocket;
    }) => {
        const [isFlipped, setIsFlipped] = useRecoilState(isBoardFlippedAtom);
        const [userSelectedMoveIndex, setUserSelectedMoveIndex] = useRecoilState(userSelectedMoveIndexAtom);
        const [moves, setMoves] = useRecoilState(movesAtom);
        const [lastMove, setLastMove] = useState<{ from: string, to: string } | null>(null)
        const [rightClickedSquares, setRightClickedSquares] = useState<string[]>([]);
        const [arrowStart, setArrowStart] = useState<string | null>(null);

        const [from, setFrom] = useState<null | Square>(null);
        const isMyTurn = myColor === chess.turn();
        const [legalMoves, setLegalMoves] = useState<string[]>([]);

        const lables = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        const boxSize = 80;
        const [gameOver, setGameOver] = useState(false);
        const moveAudio = new Audio(MoveSound);
        const captureAudio = new Audio(CaptureSound);


        useEffect(() => {

            if (myColor === 'b') {
                setIsFlipped(true);
            } else {
                setIsFlipped(false)
            }
        }, [myColor])

        useEffect(() => {
            const lMove = moves[moves.length - 1]
            if (lMove) {
                setLastMove({
                    from: lMove.from,
                    to: lMove.to
                })
            }
            else {
                setLastMove(null);
            }
        }, [moves])

        useEffect(() => {
            if (userSelectedMoveIndex !== null) {
                const move = moves[userSelectedMoveIndex];
                setLastMove({
                    from: move.from,
                    to: move.to
                });
                chess.load(move.after)
                setBoard(chess.board());
            }
        }, [userSelectedMoveIndex])

        useEffect(() => {
            if (userSelectedMoveIndex !== null) {
                chess.reset();
                moves.forEach((move) => {
                    chess.move({ from: move.from, to: move.to })
                })
                setBoard(chess.board());
                setUserSelectedMoveIndex(null);
            }
            else {
                setBoard(chess.board())
            }
        }, [moves])

        return <>
            <div className="flex relative">
                <div className="text-white-200 rounded-md overflow-hidden">
                    {(isFlipped ? board.slice().reverse() : board).map((row, i) => {
                        i = isFlipped ? i + 1 : 8 - i;
                        return (
                            <div key={i} className="flex relative">
                                <NumberNotation isMainBoxColor={isFlipped ? i % 2 !== 0 : i % 2 === 0} label={i.toString()} />
                                {(isFlipped ? row.slice().reverse() : row).map((square, j) => {
                                    j = isFlipped ? 7 - (j % 8) : j % 8
                                    const isMainBoxColor = (i + j) % 2 !== 0;
                                    const isPiece: boolean = !!square;
                                    const squareRepresentation = (String.fromCharCode(97 + j) + '' + i) as Square
                                    const isHighlightedSquare = from === squareRepresentation || squareRepresentation === lastMove?.from || squareRepresentation === lastMove?.to;
                                    const isRightClickedSquare = rightClickedSquares.includes(squareRepresentation)
                                    const piece = square && square.type;
                                    const isKingInCheckSquare = piece == 'k' && square?.color === chess.turn() && chess.inCheck();
                                    return <div onClick={() => {
                                        if (!started) {
                                            return;
                                        }
                                        if (userSelectedMoveIndex !== null) {
                                            chess.reset();
                                            moves.forEach((move) => {
                                                chess.move({ from: move.from, to: move.to })
                                            })
                                            setBoard(chess.board())
                                            setUserSelectedMoveIndex(null);
                                        }
                                        if (!from && square?.color !== chess.turn()) return;
                                        if (!isMyTurn) return;
                                        if (from != squareRepresentation) {
                                            setFrom(squareRepresentation);
                                            if (isPiece) {
                                                setLegalMoves(chess.moves({ verbose: true, square: square?.square }).map((move) => move.to))
                                            }

                                        } else {
                                            setFrom(null);
                                        }
                                        if (!isPiece) {
                                            setLegalMoves([])
                                        }
                                        if (!from) {
                                            setFrom(squareRepresentation);
                                            setLegalMoves(chess.moves({ verbose: true, square: squareRepresentation }).map((move) => move.to))

                                        } else {
                                            try {
                                                let moveResult: Move
                                                if (isPromoting(chess, from, squareRepresentation)) {
                                                    moveResult = chess.move({
                                                        from,
                                                        to: squareRepresentation,
                                                        promotion: 'q',
                                                    });
                                                } else {
                                                    moveResult = chess.move({
                                                        from,
                                                        to: squareRepresentation
                                                    })
                                                }
                                                if (moveResult) {
                                                    moveAudio.play();
                                                    if (moveResult.captured) {
                                                        captureAudio.play();
                                                    }
                                                    setMoves((prev) => [...prev, moveResult])
                                                    setFrom(null);
                                                    setLegalMoves([]);
                                                    if (moveResult.san.includes("#")) {
                                                        setGameOver(true)
                                                    }
                                                    socket.send(JSON.stringify({
                                                        type: MOVE,
                                                        payload: {
                                                            gameId,
                                                            move: moveResult
                                                        }
                                                    }))
                                                }
                                            } catch (e) {
                                                console.log('error in chessboard.tsx', e);

                                            }
                                        }
                                    }}
                                        style={{
                                            width: boxSize,
                                            height: boxSize,
                                        }}
                                        key={j}
                                        className={`${isRightClickedSquare ? (isMainBoxColor ? 'bg-[#CF664E]' : 'bg-[#E87764]') : isKingInCheckSquare ? 'bg-[#FF6347]' : isHighlightedSquare ? `${isMainBoxColor ? 'bg-[#BBCB45]' : 'bg-[#F4F687]'}` : isMainBoxColor ? 'bg-boardDark' : 'bg-boardLight'} ${''}`}
                                    >
                                        <div className="w-full justify-center flex h-full relative">
                                            {square && <ChessSquare square={square} />}
                                            {isFlipped ? i === 8 && <LetterNotation label={lables[j]} isMainBoxColor={j % 2 === 0} /> : i === 1 && <LetterNotation label={lables[j]} isMainBoxColor={j % 2 !== 0} />
                                            }
                                            {!!from && legalMoves.includes(squareRepresentation) && <LegalMoveIndicator isMainBoxColor={isMainBoxColor} isPiece={!!square?.type} />}
                                        </div>
                                    </div>
                                })}
                            </div>
                        )
                    })}





                </div>
            </div>
        </>
    })