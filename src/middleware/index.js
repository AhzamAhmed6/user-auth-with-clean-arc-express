import makeAuthUser from "./auth-user.js";
// import { findUser } from "../use-cases/index.js";
import userService from "../use-cases/index.js";
import makeTokens from "../tokens/index.js";

const { findUser } = userService;
const authUser = makeAuthUser({ ...makeTokens, findUser });

export default authUser;
