import JWT from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET; 
const REFRESH_SECRET = process.env.JWT_SECRETR;

const ACCESS_TOKEN = "10m"
const REFRESH_TOKEN = "30d"

//Funcion para el access token
export function ACCESSTOKEN(payload){
  return JWT.sign(payload, JWT_SECRET,{expiresIn: ACCESS_TOKEN});
}

//Funcion para el refresh token
export function REFRESHTOKEN(payload){
  return JWT.sign(payload, REFRESH_SECRET,{expiresIn: REFRESH_TOKEN});
}