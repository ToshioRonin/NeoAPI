import JWT from "jsonwebtoken";
import bcrypt from "bcrypt";
import prisma from "../utils/prisma.js";
import { comparePassword } from "../utils/passwordUtils.js";
import { ACCESSTOKEN } from "../services/tokenService.js";

const SALT_ROUNDS = 10;

// Logica para login
export const login = async (req, res) => {
  try {
    // Para extraer el email y la contraseña del usuario
    const { email, password } = req.body;
    console.log(req.body);

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Buscar usuario por email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Si el usuario no existe o la contraseña es inválida
    if (!user || !(await comparePassword(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Login exitoso
    const { password: userPassword, updatedAt, ...responseUser } = user;
    return res.status(200).json({
      message: "Login successful",
      token: JWT.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
      ),
      user: responseUser,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

export const RegisterUser = async (req, res) => {
  try {
    const { First_Name, Last_Name, UserName, email, phone, password, Sexo } =
      req.body; 

    // Validación básica de campos requeridos
    if (
      !First_Name ||
      !Last_Name ||
      !UserName || 
      !email ||
      !phone ||
      !password ||
      !Sexo 
    ) {
      return res.status(400).json({ error: "Todos los campos son requeridos" });
    }

    // Validación de formato de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Formato de email inválido" });
    }

    // Validación de UserName único
    const existingUserName = await prisma.user.findUnique({
      where: { UserName },
    });
    if (existingUserName) {
      return res
        .status(409)
        .json({ error: "El nombre de usuario ya está registrado" });
    }

    // Verificar si el email ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({ error: "El email ya está registrado" });
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Crear el nuevo usuario
    const newUser = await prisma.user.create({
      data: {
        First_Name,
        Last_Name,
        UserName, 
        email,
        phone,
        password: hashedPassword,
        Sexo, 
        role: "USER", 
      },
    });

    // Se genera el token de acceso
    const token = JWT.sign(
      { id: newUser.id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Eliminamos la contraseña del objeto de respuesta
    const { password: newUserPassword, ...responseUser } = newUser;

    res.status(201).json({
      message: "Usuario registrado exitosamente",
      user: responseUser,
      token,
    });
  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Logica del RefreshToken
export const RefreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res
        .status(401)
        .json({
          message: "No se proporcionó refresh token o expiró la sesión",
        });
    }

    const decoded = JWT.verify(refreshToken, process.env.JWT_SECRETR);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      res.clearCookie("refreshToken");
      return res.status(404).json({ message: "No se encontró el usuario" });
    }

    const newAccessToken = ACCESSTOKEN({
      id: user.id,
      role: user.role,
    });

    return res.status(200).json({
      accessToken: newAccessToken,
      message: "Nuevo access token generado exitosamente",
    });
  } catch (error) {
    console.error("Error al refrescar token:", error.message);
    res.clearCookie("refreshToken");
    return res.status(401).json({ message: "Sesión Cerrada" });
  }
};

// Logica para cerrar sesión y eliminar la cookie
export const logout = (req, res) => {
  res.clearCookie("refreshToken");
  return res.status(200).json({ message: "Sesión cerrada exitosamente" });
};