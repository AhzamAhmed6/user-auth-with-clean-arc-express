import bcrypt from "bcrypt";
import Id from "../Id/index.js";
import buildMakeUser from "./user.js";
import handlePassword from '../password/index.js'

const makeUser = buildMakeUser({ Id, hashPassword: handlePassword.hashPassword });
// const makeUser = buildMakeUser({ Id, hashPassword });

export default makeUser;

function hashPassword(password) {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}
