import { Request, Response, Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { User } from "../passport";
export const authRouter: Router = Router();
const COOKIE_MAX_AGE = 24 * 60 * 60 * 1000;
//this endpoint will redirect the user to google login page
authRouter.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
//google send's user profile and email data at this endpoint
authRouter.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/", session: false }),
    (req: Request, res: Response) => {
        const user = req.user as User;
        const token = jwt.sign({ user }, process.env.JWT_SECRET as string);
        res.cookie("auth_token", token, { httpOnly: true, sameSite: "strict", maxAge: COOKIE_MAX_AGE });
        res.redirect(process.env.AUTH_REDIRECT_URL as string);
    }
);
