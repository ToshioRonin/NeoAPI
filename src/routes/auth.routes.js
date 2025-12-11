import { Router } from "express";
import {
  login,
  RegisterUser,
  RefreshToken,
  logout,
} from "../controllers/auth.controllers.js";

import { verifyToken, checkRole } from "../middlewares/auth.middleware.js";

const router = Router();

// Rutas públicas
router.post("/login", login);
router.post("/register", RegisterUser);
router.post("/refresh-token", RefreshToken);
router.post("/logout", logout);

// Ruta protegida solo para ADMIN
router.get(
  "/test",
  verifyToken,
  checkRole(["ADMIN"]),
  (req, res) => {
    res.send("ruta protegida");
  }
);

export default router;
