import { useState, useEffect } from "react"
import { Button } from "./Button";
import { motion, AnimatePresence } from "framer-motion";

export const ShareGame = ({className, gameId}: {className?: string, gameId: string}) => {
    const url = window.origin + "/game/" + gameId;
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        window.navigator.clipboard.writeText(url);
        setCopied(true);
    }

    // Reset copied state after 3 seconds
    useEffect(() => {
        if (copied) {
            const timer = setTimeout(() => setCopied(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [copied]);

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`flex flex-col items-center gap-y-6 bg-slate-800/50 rounded-xl shadow-lg border w-3/4 p-5 border-blue-500/20 ${className}`}
        >
            <motion.h3 
                className="text-3xl font-bold text-blue-400 flex items-center gap-2"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <motion.span
                    animate={{ rotate: [0, -10, 0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                >
                    🎮
                </motion.span>
                Play with Friends
            </motion.h3>

            <motion.div 
                className="flex items-center gap-x-3 bg-slate-700/70 p-3 rounded-lg w-full max-w-md overflow-hidden"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
            >
                <motion.div
                    whileHover={{ rotate: 15 }}
                    className="text-blue-400"
                >
                    <LinkSvg />
                </motion.div>

                <div 
                    onClick={handleCopy} 
                    className="text-slate-200 cursor-pointer font-mono text-sm truncate hover:text-blue-300 transition-colors"
                >
                    {url}
                </div>
            </motion.div>
            
            <AnimatePresence mode="wait">
                <motion.div
                    key={copied ? "copied" : "copy"}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                >
                    <Button 
                        onClick={handleCopy} 
                        variant={copied ? "secondary" : "primary"}
                        
                    >
                        {copied ? "✅ Copied to Clipboard!" : "📋 Copy Invite Link"}
                    </Button>
                </motion.div>
            </AnimatePresence>
        </motion.div>
    )
}

const LinkSvg = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-link text-white">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
        </svg>
    )
}