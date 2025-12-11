import JWT from 'jsonwebtoken';

// verificacion del Access Token
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ mensaje: 'Token no enviado' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ mensaje: 'Token mal formateado' });
  }

  try {
    const decoded = JWT.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        mensaje: 'Access Token expirado',
        code: 'ACCESS_TOKEN_EXPIRED'
      });
    }

    return res.status(403).json({ mensaje: 'Token inválido' });
  }
};// Middleware de rol
export const checkRole = (rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ mensaje: 'Usuario no autenticado' });
    }

    if (!rolesPermitidos.includes(req.user.role)) {
      return res.status(403).json({ mensaje: 'Acceso denegado: rol insuficiente' });
    }

    next();
  };
};