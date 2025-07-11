import {
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogTitle,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogDescription,
  } from './ui/alert-dialog';
import { motion } from 'framer-motion';
import { Button } from './Button';
  
  const ExitGameModel = ({ onClick } : {onClick : () => void}) => {
  
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button 
            variant="outline" 
            size="md"
            className="bg-gradient-to-r from-red-500/80 to-red-700/80 text-white border-red-500/50 hover:from-red-600/90 hover:to-red-800/90 shadow-md"
          >
            <motion.span
              initial={{ opacity: 0.8 }}
              whileHover={{ 
                opacity: 1,
                scale: 1.05,
                textShadow: "0 0 8px rgba(255,255,255,0.5)"
              }}
              transition={{ duration: 0.2 }}
            >
              Exit Game
            </motion.span>
          </Button>
        </AlertDialogTrigger>
        
        <AlertDialogContent className='bg-gradient-to-b from-slate-800 to-slate-900 border border-blue-500/20 rounded-xl shadow-2xl p-0 overflow-hidden max-w-md w-full'>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AlertDialogHeader className="p-6 pb-2">
              <AlertDialogTitle className='text-blue-400 font-bold text-2xl mb-2'>
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                  className="flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Are you sure you want to exit?
                </motion.div>
              </AlertDialogTitle>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                <AlertDialogDescription className='text-slate-300 mt-4 text-base'>
                  This action cannot be undone. Exiting the game will be considered as a <span className="text-red-400 font-medium">loss</span>.
                </AlertDialogDescription>
              </motion.div>
            </AlertDialogHeader>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              <AlertDialogFooter className="p-6 pt-2 flex gap-3">
                <AlertDialogCancel asChild>
                  <Button  
                    size="md"
                    className='bg-blue-500 hover:bg-transparent hover:text-blue-500'
                  >
                    <motion.span
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      ♟️ Continue Playing
                    </motion.span>
                  </Button>
                </AlertDialogCancel>
                
                <AlertDialogAction asChild>
                  <Button 
                    className='bg-red-500 hover:bg-transparent hover:text-red-500 hover:border-red-500 border-red-500'
                    size="md"
                    onClick={onClick}
                  >
                    <motion.span
                      whileHover={{ 
                        scale: 1.05,
                        textShadow: "0 0 8px rgba(255,255,255,0.5)"
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      🚪 Exit Game
                    </motion.span>
                  </Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </motion.div>
          </motion.div>
        </AlertDialogContent>
      </AlertDialog>
    );
  };
  
  export default ExitGameModel;
  