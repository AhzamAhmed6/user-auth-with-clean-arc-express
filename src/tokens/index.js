import jwt from "jsonwebtoken";
import makeTokens from "./tokens";
import dotenv from "dotenv";
dotenv.config();

const jwtKey = process.env.JWT_KEY
const expTime = process.env.EXP_TIME

const tokens = makeTokens({ jwt, jwtKey, expTime })
export default tokens