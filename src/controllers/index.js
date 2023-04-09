import {
  addUser,
  editUserName,
  editUserPassword,
  findUser,
  removeUser,
} from "../use-cases/index.js";
import makeTokens from "../tokens/index.js";
import handlePassword from "../password/index.js";

import makeDeleteUser from "./delete-user.js";
import makeGetUser from "./get-user.js";
import makeLoginUser from "./login-user.js";
import makePatchUserName from "./patch-user-name.js";
import makePatchUserPassword from "./patch-user-password.js";
import makePostUser from "./post-user.js";
import notFound from "./not-found.js";

const userController = Object.freeze({
  deleteUser: makeDeleteUser({ removeUser }),
  getUser: makeGetUser({ findUser }),
  loginUser: makeLoginUser({
    findUser,
    makeTokens,
    verifyPassword: handlePassword.verifyPassword,
  }),
  notFound,
  patchUserName: makePatchUserName({ editUserName }),
  patchUserPassword: makePatchUserPassword({ editUserPassword }),
  postUser: makePostUser({ addUser, makeTokens }),
});

export default userController;
