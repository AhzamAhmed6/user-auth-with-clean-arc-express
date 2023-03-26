import jwt from "jsonwebtoken";
import buildMakeTokens from "./tokens.js";
import dotenv from "dotenv";
dotenv.config();

const jwtKey = process.env.JWT_KEY;
const expTime = process.env.EXP_TIME;

const makeTokens = buildMakeTokens({ jwt, jwtKey, expTime });
export default makeTokens;
