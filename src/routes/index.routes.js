import { Router } from "express";
import authroutes from "./auth.routes.js";
import profileroutes from "./profile.routes.js";

const router = Router();

router.use("/auth", authroutes);
router.use("/profile", profileroutes);

export default router;
