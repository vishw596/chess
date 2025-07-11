import { AuthWrapper } from "../components/AuthWrapper";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSetRecoilState } from "recoil";
import { userAtom } from "../store/atoms/user";
import { motion } from "framer-motion";

export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const setUser = useSetRecoilState(userAtom);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const response = await axios.post("http://localhost:3000/auth/login", {
                email,
                password
            }, {
                withCredentials: true
            });

            if (response.data.success) {
                setUser(response.data.user);
                navigate("/");
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Login failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthWrapper title="Welcome Back">
            {error && (
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-3 bg-red-900/50 text-red-300 rounded-lg border border-red-800/50 backdrop-blur-sm"
                >
                    {error}
                </motion.div>
            )}
            
            <form onSubmit={handleLogin} className="space-y-5">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                    <input
                        type="email"
                        className="w-full px-4 py-3 bg-slate-700/50 border border-blue-500/20 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 text-white placeholder-slate-400 transition-all duration-300"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </motion.div>
                
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                    <input
                        type="password"
                        className="w-full px-4 py-3 bg-slate-700/50 border border-blue-500/20 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 text-white placeholder-slate-400 transition-all duration-300"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </motion.div>
                
                <motion.button 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white py-3 rounded-lg transition-all duration-300 font-semibold border border-blue-500 hover:border-blue-400 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500/50 focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                            Logging in...
                        </div>
                    ) : "Login"}
                </motion.button>
            </form>

            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-6 flex items-center justify-between"
            >
                <span className="border-t border-slate-600 w-1/5 lg:w-1/4"></span>
                <span className="text-xs text-center text-slate-400 uppercase tracking-wider">or continue with</span>
                <span className="border-t border-slate-600 w-1/5 lg:w-1/4"></span>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-4"
            >
                <button
                    className="w-full flex items-center justify-center gap-3 border border-slate-600 py-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 text-slate-300 transition-all duration-300 shadow-md hover:shadow-lg hover:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500/50 focus:ring-offset-slate-800"
                    onClick={() => {
                        window.location.href = "http://localhost:3000/auth/google"
                    }}
                    type="button"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" fill="currentColor"/>
                    </svg>
                    Continue with Google
                </button>
            </motion.div>

            <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-6 text-center text-sm text-slate-400"
            >
                Don't have an account?
                <a href="/signup" className="text-blue-400 hover:text-blue-300 ml-1 transition-colors font-medium hover:underline">
                    Sign up
                </a>
            </motion.p>
        </AuthWrapper>
    );
};