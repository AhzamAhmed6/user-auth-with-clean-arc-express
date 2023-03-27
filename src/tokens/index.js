import jwt from "jsonwebtoken";
import buildMakeTokens from "./tokens.js";
import dotenv from "dotenv";
dotenv.config();

const makeTokens = buildMakeTokens({ jwt });
export default makeTokens;
