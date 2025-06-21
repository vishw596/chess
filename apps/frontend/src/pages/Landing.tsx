import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";

export const Landing = () => {
    const navigate = useNavigate();
    return (
        <div className="text-amber-200">
            <div className="text-2xl font-bold">Landing Page</div>
            <div>Welcome to the Chess app</div>
            <Button onClick={() => {
                    navigate("/game");
                }}>Play Now!</Button>
        </div>
    );
};
