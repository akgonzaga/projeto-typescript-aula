import { Router, type Request, type Response } from "express";
import { AuthController } from "../controllers/AuthController.js";
import { RefreshTokenService } from "../services/RefreshTokenService.js";
import { AuthService } from "../services/AuthService.js";
import { LogoutService } from "../services/LogoutService.js";

const refreshTokenService: RefreshTokenService = new RefreshTokenService();
const authService: AuthService = new AuthService()
const logoutService: LogoutService = new LogoutService();

const authController: AuthController = new AuthController( authService, refreshTokenService, logoutService);
const authRouter = Router();

authRouter.post("/login", (req: Request, res: Response) => authController.login(req, res));
authRouter.post("/refresh", (req: Request, res: Response) => authController.refresh(req, res));
authRouter.post("/logout", (req: Request, res: Response) => authController.logout(req, res));

export default authRouter;


