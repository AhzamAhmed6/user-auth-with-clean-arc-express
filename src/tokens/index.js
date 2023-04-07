import jwt from "jsonwebtoken";
import buildMakeTokens from "./tokens.js";

const makeTokens = buildMakeTokens({ jwt });
export default makeTokens;
