import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", verifyToken, (req, res) => {
  res.send("Perfil del usuario");
});

export default router;
