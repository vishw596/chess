import { useUser } from '../store/hooks/useUser';
import type { Metadata, Player } from '../pages/Game';
import { motion } from 'framer-motion';

interface UserAvatarProps {
  gameMetadata: Metadata | null;
  self?: boolean;
}

export const UserAvatar = ({ gameMetadata, self }: UserAvatarProps) => {
  const user = useUser();
  let player: Player;
  if (gameMetadata?.blackPlayer.id === user.id) {
    player = self ? gameMetadata.blackPlayer : gameMetadata.whitePlayer;
  } else {
    player = self ? gameMetadata?.whitePlayer! : gameMetadata?.blackPlayer!;
  }

  // Determine piece color based on player
  const pieceType = self ? 
    (gameMetadata?.blackPlayer.id === user.id ? 'b' : 'w') : 
    (gameMetadata?.blackPlayer.id === user.id ? 'w' : 'b');
  
  const pieceImage = `/${pieceType}k.png`; // King piece for avatar

  return (
    <div className="flex items-center gap-3">
      <motion.div 
        whileHover={{ scale: 1.1, rotate: 5 }}
        className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 p-0.5 shadow-lg"
      >
        <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center overflow-hidden">
          <img src={pieceImage} alt="Chess Piece" className="w-7 h-7 object-contain" />
        </div>
      </motion.div>
      
      <div className="flex flex-col">
        <p className="text-white font-medium">{player?.name}</p>
        {player?.isGuest && (
          <p className="text-slate-400 text-xs">Guest Player</p>
        )}
      </div>
    </div>
  );
};
