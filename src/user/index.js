import Id from "../Id/index.js";
import handlePassword from "../password/index.js";
import buildMakeUser from "./user.js";
import validateInputs from "./validate-inputs.js";

const { hashPassword } = handlePassword;

const makeUser = buildMakeUser({ Id, hashPassword, validateInputs });

export default makeUser;
