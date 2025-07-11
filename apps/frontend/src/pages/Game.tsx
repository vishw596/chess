/* eslint-disable no-case-declarations */
import { useEffect, useRef, useState } from "react";
import { Button } from "../components/Button";
import { ChessBoard, isPromoting } from "../components/ChessBoard";
import { useSocket } from "../hooks/useSocket";
import { Chess, Move } from "chess.js";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { EXIT_GAME, GAME_ADDED, GAME_ENDED, GAME_JOINED, GAME_OVER, GAME_TIME, GAME_TIME_MS, INIT_GAME, JOIN_ROOM, MOVE, Result, USER_TIMEOUT } from "@repo/messages"
import MoveSound from "/move.wav"
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../store/hooks/useUser";
import { movesAtom, userSelectedMoveIndexAtom } from "../store/atoms/chessBoard";
import GameEndModal from "../components/GameEndModal";
import { UserAvatar } from "../components/UserAvatar";
import { Waitopponent } from "../components/Waitopponent";
import { ShareGame } from "../components/ShareGame";
import ExitGameModel from "../components/ExitModel";
import { MovesTable } from "../components/MovesTable";
import { motion } from "framer-motion";

export interface GameResult {
    result: Result;
    by: string;
}
const moveAudio = new Audio('/move.wav');

export interface Player {
    id: string;
    name: string;
    isGuest: boolean;
}

export interface Metadata {
    blackPlayer: Player;
    whitePlayer: Player;
}

export const Game = () => {
    //the useSocket Hook establishes the connection to the websocket server
    const socket = useSocket();
    const { gameId } = useParams();
    
    const user = useUser();
    const navigate = useNavigate();

    const [chess, _setChess] = useState(new Chess());
    const [board, setBoard] = useState(chess.board());
    const [added, setAdded] = useState(false);
    const [started, setStarted] = useState(false);
    const [gameMetadata, setGameMetadata] = useState<Metadata | null>(null);
    const [result, setResult] = useState<GameResult | null>(null);
    const [player1TimeConsumed, setPlayer1TimeConsumed] = useState(0);
    const [player2TimeConsumed, setPlayer2TimeConsumed] = useState(0);
    const [gameID, setGameID] = useState("");
    const setMoves = useSetRecoilState(movesAtom);
    const userSelectedMoveIndex = useRecoilValue(userSelectedMoveIndexAtom);
    const userSelectedMoveIndexRef = useRef(userSelectedMoveIndex);

    useEffect(() => {
        userSelectedMoveIndexRef.current = userSelectedMoveIndex
    }, [userSelectedMoveIndex])

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate])

    useEffect(() => {
        if (!socket) {
            return;
        }
        socket.onmessage = function (event) {
            const message = JSON.parse(event.data);
            switch (message.type) {
                case GAME_ADDED:
                    setAdded(true)
                    setGameID((p) => message.gameId);
                    break;
                case INIT_GAME:
                    setBoard(chess.board());
                    setStarted(true);
                    navigate(`/game/${message.payload.gameId}`)
                    setGameMetadata({
                        blackPlayer: message.payload.blackPlayer,
                        whitePlayer: message.payload.whitePlayer,
                    })
                    break;
                case MOVE:
                    const { move, player1TimeConsumed, player2TimeConsumed } = message.payload;
                    setPlayer1TimeConsumed(player1TimeConsumed)
                    setPlayer2TimeConsumed(player2TimeConsumed)
                    if (userSelectedMoveIndexRef.current !== null) {
                        setMoves((moves) => [...moves, move]);
                        return;
                    }
                    try {
                        if (isPromoting(chess, move.from, move.to)) {
                            chess.move({
                                from: move.from,
                                to: move.to,
                                promotion: 'q'
                            })
                        } else {
                            chess.move({ from: move.from, to: move.to })
                        }
                        setMoves((moves) => [...moves, move])
                        moveAudio.play();
                    } catch (error) {
                        // alert('Error in Game.tsx ' + error)
                        console.log('Error in Game.tsx', error);
                    }
                    break;
                case GAME_OVER:
                    setResult(message.payload.result)
                    break;
                case GAME_ENDED:
                    let wonBy;
                    switch (message.payload.status) {
                        case 'COMPLETED':
                            wonBy = message.payload.result !== 'DRAW' ? 'CheckMate' : 'Draw'
                            break;
                        case 'PLAYER_EXIT':
                            wonBy = 'Player Exit'
                            break;
                        default:
                            wonBy = 'Timeout';
                    }
                    setResult({
                        result: message.payload.result,
                        by: wonBy
                    })
                    chess.reset();
                    setMoves([])
                    setStarted(false)
                    setAdded(false)
                    
                    break;
                case USER_TIMEOUT:
                    setResult(message.payload.win);
                    break;
                case GAME_JOINED:
                    setGameMetadata({
                        blackPlayer: message.payload.blackPlayer,
                        whitePlayer: message.payload.whitePlayer
                    })
                    setPlayer1TimeConsumed(message.payload.player1TimeConsumed);
                    setPlayer2TimeConsumed(message.payload.player2TimeConsumed)
                    console.error(message.payload);
                    setStarted(true);
                    message.payload.moves.map((x: Move) => {
                        if (isPromoting(chess, x.from, x.to)) {
                            chess.move({ ...x, promotion: 'q' })
                        } else {
                            chess.move(x)
                        }
                    })
                    setMoves(message.payload.moves);
                    break;
                case GAME_TIME:
                    setPlayer1TimeConsumed(message.payload.player1Time);
                    setPlayer2TimeConsumed(message.payload.player2Time);
                    break;
                default:
                    alert(message.payload.message)
                    break;
            }
        }
        if (gameId !== 'random') {
            socket.send(JSON.stringify({
                type: JOIN_ROOM,
                payload: {
                    gameId
                }
            }))
        }
    }, [chess, socket]);
    useEffect(() => {
        if (started) {
            const interval = setInterval(() => {
                if (chess.turn() === 'w') {
                    setPlayer1TimeConsumed((p) => p + 100)
                } else {
                    setPlayer2TimeConsumed((p) => p + 100)
                }
            }, 100)
            return () => clearInterval(interval);
        }
    }, [started, gameMetadata, user])

    const getTimer = (timeConsumed: number) => {
        const timeLeftMs = GAME_TIME_MS - timeConsumed;
        const minutes = Math.floor(timeLeftMs / (1000 * 60));
        const remainingSeconds = Math.floor((timeLeftMs % (1000 * 60)) / 1000)
        return (
            <div className="text-white">
                Time Left: {minutes < 10 ? '0' : ''}
                {minutes}:{remainingSeconds < 10 ? '0' : ''}
                {remainingSeconds}
            </div>)
    }
    const handleExit = () => {
        socket?.send(JSON.stringify({
            type: EXIT_GAME, payload: {
                gameId
            }
        }))
        socket?.close()
        setMoves([])
        navigate('/')
    }
    if (!socket) return <div>Connecting...</div>

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-cyan-500/5 to-blue-800/10 pointer-events-none"></div>
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            {result && (<GameEndModal blackPlayer={gameMetadata?.blackPlayer} whitePlayer={gameMetadata?.whitePlayer} gameResult={result} socket={socket} />)}
            
            {started && (
                <div className="justify-center flex pt-2 mb-4 relative z-10">
                    <motion.div 
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className={`px-6 py-2 rounded-lg ${(user.id === gameMetadata?.blackPlayer.id ? "b" : "w") === chess.turn() ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-900/20 border border-blue-500' : 'bg-slate-800 text-slate-300 border border-slate-700'} font-semibold`}
                    >
                        {(user.id === gameMetadata?.blackPlayer.id ? "b" : "w") === chess.turn() ? 'Your turn' : "Opponent's turn"}
                    </motion.div>
                </div>
            )}
            
            <div className="justify-center flex">
                <div className="w-full max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row gap-4 w-full">
                        <div className="text-white lg:w-2/3">
                            <div className="flex justify-center">
                                <div className="w-full">
                                    {started && (
                                        <div className="mb-2 bg-slate-800/80 rounded-lg p-3 border border-blue-500/20 shadow-md backdrop-blur-sm">
                                            <div className="flex justify-between items-center">
                                                <UserAvatar gameMetadata={gameMetadata} />
                                                <div className="bg-slate-900 px-4 py-1.5 rounded-lg font-mono text-blue-400 border border-slate-700 shadow-inner">
                                                    {getTimer(user.id === gameMetadata?.whitePlayer?.id ? player2TimeConsumed : player1TimeConsumed)}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    
                                    <div className="rounded-lg overflow-hidden border border-blue-500/20 shadow-2xl relative">
                                        <div className="absolute inset-0 bg-blue-500/5 mix-blend-overlay pointer-events-none"></div>
                                        <div className={`w-full flex justify-center text-white relative z-10`}>
                                            <ChessBoard 
                                                started={started}
                                                gameId={gameId ?? ''}
                                                myColor={user?.id === gameMetadata?.blackPlayer.id ? "b" : "w"}
                                                chess={chess}
                                                board={board}
                                                socket={socket}
                                                setBoard={setBoard}
                                            />
                                        </div>
                                    </div>
                                    
                                    {started && (
                                        <div className="mt-2 bg-slate-800/80 rounded-lg p-3 border border-blue-500/20 shadow-md backdrop-blur-sm">
                                            <div className="flex justify-between items-center">
                                                <UserAvatar gameMetadata={gameMetadata} self />
                                                <div className="bg-slate-900 px-4 py-1.5 rounded-lg font-mono text-blue-400 border border-slate-700 shadow-inner">
                                                    {getTimer(user.id === gameMetadata?.blackPlayer.id ? player2TimeConsumed : player1TimeConsumed)}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        <div className="rounded-lg bg-slate-800/90 flex-1 overflow-auto overflow-y-auto no-scrollbar border border-blue-500/20 shadow-2xl backdrop-blur-sm lg:w-1/3 relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent pointer-events-none"></div>
                            {!started ? (
                                <div className="pt-4 flex justify-center w-full">
                                    {added ? (
                                        <div className='flex flex-col items-center space-y-4 justify-center p-4'>
                                            <div className="text-white"><Waitopponent /></div>
                                            <ShareGame gameId={gameID} />
                                        </div>
                                    ) : (
                                        gameId === 'random' && (
                                            <div className="p-6">
                                                <Button
                                                    variant="primary"
                                                    size="lg"
                                                    
                                                    onClick={() => {
                                                        socket.send(JSON.stringify({
                                                            type: INIT_GAME,
                                                        }))
                                                    }}
                                                >
                                                    🎲 Start Random Game
                                                </Button>
                                            </div>
                                        )
                                    )}
                                </div>
                            ) : (
                                <div className="p-4 flex justify-center w-full">
                                    <ExitGameModel onClick={() => handleExit()} />
                                </div>
                            )}
                            <div className="px-4 pb-4">
                                <MovesTable />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}