import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Landing } from "./pages/Landing";
import { Game } from "./pages/Game";
import { Login } from "./pages/Login";
import { Signup } from "./pages/SignUp";

function App() {
    return (
        <>
            <div className="bg-slate-800 h-screen w-screen">
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Landing />} />
                        <Route path="/game" element={<Game />} />
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/signup" element={<Signup/>}/>
                    </Routes>
                </BrowserRouter>
            </div>
        </>
    );
}

export default App;
