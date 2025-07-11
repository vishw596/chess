import React, { useState } from 'react';
import WhiteKing from '../../public/wk.png';
import BlackKing from '../../public/bk.png';
import { type GameResult } from "../pages/Game";
import { Result } from '@repo/messages';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';
import { useNavigate } from 'react-router-dom';

interface ModalProps {
  blackPlayer?: { id: string; name: string };
  whitePlayer?: { id: string; name: string };
  gameResult: GameResult;
  socket: WebSocket | null;
}

const GameEndModal: React.FC<ModalProps> = ({
  blackPlayer,
  whitePlayer,
  gameResult,
  socket
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate()
  const closeModal = () => {
    setIsOpen(false);
    socket?.close()
    navigate("/")
    
  };

  const PlayerDisplay = ({
    player,
    gameResult,
    isWhite,
  }: {
    player?: { id: string; name: string };
    gameResult: Result;
    isWhite: boolean;
  }) => {
    const imageSrc = isWhite ? WhiteKing : BlackKing;
    const isWinner = gameResult === (isWhite ? Result.WHITE_WINS : Result.BLACK_WINS);
    const glowColor = isWinner ? 'blue' : 'slate';
    
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: isWhite ? 0.2 : 0.4 }}
        className="flex flex-col items-center"
      >
        <motion.div 
          className={`rounded-full p-3 bg-gradient-to-br from-${glowColor}-400/80 to-${glowColor}-600/80 shadow-lg`}
          animate={isWinner ? {
            scale: [1, 1.05, 1],
            boxShadow: [
              '0 0 0 rgba(59, 130, 246, 0)',
              '0 0 20px rgba(59, 130, 246, 0.7)',
              '0 0 0 rgba(59, 130, 246, 0)'
            ]
          } : {}}
          transition={{
            repeat: isWinner ? Infinity : 0,
            duration: 2
          }}
        >
          <div className="bg-slate-800 rounded-full p-2">
            <motion.img
              src={imageSrc}
              alt={`${isWhite ? 'White' : 'Black'} King`}
              className="w-12 h-12"
              animate={isWinner ? { rotate: [0, 5, 0, -5, 0] } : {}}
              transition={{ repeat: isWinner ? Infinity : 0, duration: 2 }}
            />
          </div>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center p-2"
        >
          <p 
            className={`font-medium truncate w-24 ${isWinner ? 'text-blue-300' : 'text-slate-300'}`} 
            title={getPlayerName(player)}
          >
            {getPlayerName(player)}
          </p>
        </motion.div>
      </motion.div>
    );
  };

  const getWinnerMessage = (result: Result) => {
    switch (result) {
      case Result.BLACK_WINS:
        return 'Black Wins!';
      case Result.WHITE_WINS:
        return 'White Wins!';
      default:
        return "It's a Draw";
    }
  };

  const getPlayerName = (player: { id: string; name: string } | undefined) => {
    return player ? player.name : 'Unknown';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center z-50"
        >
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.85 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900 backdrop-blur-sm"
            onClick={closeModal}
          />
          
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 20 }}
            className="relative rounded-xl overflow-hidden shadow-2xl bg-gradient-to-b from-slate-800 to-slate-900 w-full max-w-md border border-blue-500/20"
          >
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="px-8 py-10 items-center"
            >
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="mb-8"
              >
                <h2 className={`text-4xl font-bold mb-3 ${gameResult.result === Result.DRAW ? 'text-slate-300' : 'text-blue-400'} text-center`}>
                  {getWinnerMessage(gameResult.result)}  
                </h2>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="h-0.5 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent mx-auto"
                />
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mb-8"
              >
                <p className="text-xl text-slate-300 text-center font-light">
                  by <span className="text-blue-300 font-medium">{gameResult.by}</span>
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex flex-row justify-between items-center bg-slate-800/50 rounded-xl px-6 py-8 shadow-inner border border-blue-500/20"
              >
                <PlayerDisplay isWhite={true} player={whitePlayer} gameResult={gameResult.result} />
                
                <motion.div 
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5, type: 'spring' }}
                  className="relative"
                >
                  <div className="text-blue-400 text-2xl font-bold bg-slate-800/80 px-4 py-2 rounded-full shadow-lg border border-blue-500/20">
                    VS
                  </div>
                </motion.div>
                
                <PlayerDisplay isWhite={false} player={blackPlayer} gameResult={gameResult.result} />
              </motion.div>
            </motion.div>
            
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="px-6 py-5 bg-slate-900/80 flex justify-center rounded-b-lg border-t border-blue-500/20"
            >
              <Button
                variant="secondary"
                size="md"
                onClick={closeModal}
              >
                ✨ Close
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GameEndModal;
