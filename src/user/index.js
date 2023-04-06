import Id from "../Id/index.js";
import buildMakeUser from "./user.js";
import handlePassword from "../password/index.js";

const makeUser = buildMakeUser({
  Id,
  hashPassword: handlePassword.hashPassword,
});

export default makeUser;

