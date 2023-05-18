import makeAuthUser from "./auth-user.js";
import { findUser } from "../use-cases/index.js";
import makeTokens from "../tokens/index.js";

const authUser = makeAuthUser({ ...makeTokens, findUser });

export default authUser;
