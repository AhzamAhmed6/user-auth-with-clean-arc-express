import makeAuthUser from "./auth-user.js";
import makeTokens from "../tokens/index.js";

const authUser = makeAuthUser({ ...makeTokens });

export default authUser;
