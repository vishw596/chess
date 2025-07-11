import type { Move } from "chess.js"
import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight, FlagIcon, HandshakeIcon, RefreshCw } from "lucide-react"
import { useEffect, useRef } from "react"
import { useSetRecoilState, useRecoilValue, useRecoilState } from "recoil"
import { isBoardFlippedAtom, movesAtom, userSelectedMoveIndexAtom } from "../store/atoms/chessBoard"

export const MovesTable = () => {
    const [userSelectedMoveIndex, setUserSelectedMoveIndex] = useRecoilState(userSelectedMoveIndexAtom)
    const setIsFlipped = useSetRecoilState(isBoardFlippedAtom)
    const moves = useRecoilValue(movesAtom);
    const movesTableRef = useRef<HTMLDivElement>(null)
    const movesArray = moves.reduce((result, _, index: number, array: Move[]) => {
        if (index % 2 == 0) {
            result.push(array.slice(index, index + 2))
        }
        return result
    }, [] as Move[][])

    useEffect(() => {
        if (movesTableRef && movesTableRef.current) {
            movesTableRef.current.scrollTo({
                top: movesTableRef.current.scrollHeight,
                behavior: 'smooth'
            })
        }
    }, [moves])
    if (moves.length === 0) {
        return <></>
        // return <div className="relative w-full bg-slate-800 rounded-lg border border-blue-500/20 overflow-hidden">
        //     <div className="p-3 bg-slate-800 border-b border-blue-500/20">
        //         <h3 className="text-blue-300 font-bold text-base flex items-center">
        //             Move History
        //         </h3>
        //     </div>
        // </div>
    }
    return (
        <div className="relative w-full bg-slate-800 rounded-lg border border-blue-500/20 overflow-hidden">
            <div className="p-3 bg-slate-800 border-b border-blue-500/20">
                <h3 className="text-blue-300 font-bold text-base flex items-center">
                    Move History
                </h3>
            </div>
            
            <div 
                className="text-sm h-[40vh] max-h-[40vh] overflow-y-auto no-scrollbar" 
                ref={movesTableRef}
            >
                {movesArray.map((movePairs, index) => {
                    return (
                        <div 
                            key={index}
                            className={`w-full py-1 px-4 font-medium items-stretch ${index % 2 !== 0 ? 'bg-slate-700/50' : 'bg-slate-800'}`}
                        >
                            <div className="grid grid-cols-6 gap-4 w-full">
                                <span className="text-slate-400 px-2 py-1.5 text-right">
                                    {`${index + 1}.`}
                                </span>
                                {movePairs.map((move, movePairIndex) => {
                                    const isLastIndex = movePairIndex === movePairs.length - 1 && movesArray.length - 1 === index
                                    const isHighlighted = userSelectedMoveIndex !== null ? userSelectedMoveIndex === index * 2 + movePairIndex : isLastIndex
                                    const { san } = move
                                    return (
                                        <div 
                                            key={movePairIndex}
                                            className={`col-span-2 cursor-pointer flex items-center justify-center w-full px-2 py-1.5 rounded-md ${isHighlighted ? 'bg-blue-500/20 text-blue-300' : 'hover:bg-slate-700 text-slate-300'}`}
                                            onClick={() => {
                                                setUserSelectedMoveIndex(index * 2 + movePairIndex);
                                            }}
                                        >
                                            <span className={isHighlighted ? 'font-bold' : ''}>{san}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )
                })}
            </div>
            {moves.length ? (
                <div className="w-full p-3 bg-slate-800 border-t border-blue-500/20 flex items-center justify-between">
                   
                    <div className="flex gap-1 bg-slate-700 p-1 rounded-md border border-slate-600">
                        <button
                            onClick={() => {
                                setUserSelectedMoveIndex(0);
                            }}
                            disabled={userSelectedMoveIndex === 0}
                            className={`p-1 rounded-md ${userSelectedMoveIndex === 0 ? 'text-slate-500' : 'text-slate-300 hover:bg-slate-600'}`}
                            title="Go to first move"
                        >
                            <ChevronFirst size={16} />
                        </button>

                        <button
                            onClick={() => {
                                setUserSelectedMoveIndex((prev) =>
                                    prev !== null ? prev - 1 : moves.length - 2,
                                );
                            }}
                            disabled={userSelectedMoveIndex === 0}
                            className={`p-1 rounded-md ${userSelectedMoveIndex === 0 ? 'text-slate-500' : 'text-slate-300 hover:bg-slate-600'}`}
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <button
                            onClick={() => {
                                setUserSelectedMoveIndex((prev) =>
                                    prev !== null
                                        ? prev + 1 >= moves.length - 1
                                            ? moves.length - 1
                                            : prev + 1
                                        : null,
                                );
                            }}
                            disabled={userSelectedMoveIndex === null}
                            className={`p-1 rounded-md ${userSelectedMoveIndex === null ? 'text-slate-500' : 'text-slate-300 hover:bg-slate-600'}`}
                        >
                            <ChevronRight size={16} />
                        </button>
                        <button
                            onClick={() => {
                                setUserSelectedMoveIndex(moves.length - 1);
                            }}
                            disabled={userSelectedMoveIndex === null}
                            className={`p-1 rounded-md ${userSelectedMoveIndex === null ? 'text-slate-500' : 'text-slate-300 hover:bg-slate-600'}`}
                            title="Go to last move"
                        >
                            <ChevronLast size={16} />
                        </button>
                        <div className="w-px h-5 bg-slate-600 mx-1 self-center"></div>
                        <button
                            onClick={() => {
                                setIsFlipped((prev) => !prev);
                            }}
                            className="p-1 rounded-md text-slate-300 hover:bg-slate-600"
                            title="Flip the board"
                        >
                            <RefreshCw size={16} />
                        </button>
                    </div>
                </div>
            ) : null}
        </div>
    )
}