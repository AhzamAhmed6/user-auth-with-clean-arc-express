import {
  addUser,
  authenticateUser,
  editUserName,
  editUserPassword,
  findUser,
  removeUser,
} from "../use-cases/index.js";
import makeTokens from "../tokens/index.js";

import makeDeleteUser from "./delete-user.js";
import makeGetUser from "./get-user.js";
import makeLoginUser from "./login-user.js";
import makeVerifyUser from "./verify-user.js";
import makePatchUserName from "./patch-user-name.js";
import makePatchUserPassword from "./patch-user-password.js";
import makePostUser from "./post-user.js";
import notFound from "./not-found.js";
import postUserDependencies from "../controller-helper/post-user.helper.js";
import loginUserDependencies from "../controller-helper/login-user.helper.js";

const requiredEnvVars = [
  "ACCESS_KEY",
  "ACCESS_EXP_TIME",
  "REFRESH_KEY",
  "REFRESH_EXP_TIME",
];

const userController = Object.freeze({
  postUser: makePostUser(postUserDependencies),
  loginUser: makeLoginUser({ authenticateUser, ...loginUserDependencies }),
  deleteUser: makeDeleteUser({
    verifyToken: makeTokens.verifyToken,
    removeUser,
  }),
  verifyUser: makeVerifyUser({ findUser }),

  getUser: makeGetUser({ findUser }),

  notFound,
  patchUserName: makePatchUserName({ editUserName }),
  patchUserPassword: makePatchUserPassword({ editUserPassword }),
});

export default userController;
