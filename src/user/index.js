import Id from "../Id/index.js";
import buildMakeUser from "./user.js";
import handlePassword from "../password/index.js";

const dependencies = {
  Id: Id,
  hashPassword: handlePassword.hashPassword,
};

const makeUser = buildMakeUser(dependencies);

export default makeUser;
