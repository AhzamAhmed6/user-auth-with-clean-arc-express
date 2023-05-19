import {
  authenticateUser,
  editUserName,
  editUserPassword,
  findUser,
  removeUser,
} from "../use-cases/index.js";

import makeDeleteUser from "./delete-user.js";
import makeGetUser from "./get-user.js";
import makeLoginUser from "./login-user.js";
import verifyUser from "./verify-user.js";
import makePatchUserName from "./patch-user-name.js";
import makePatchUserPassword from "./patch-user-password.js";
import makePostUser from "./post-user.js";
import notFound from "./not-found.js";
import postUserDependencies from "../controller-helper/post-user.helper.js";
import loginUserDependencies from "../controller-helper/login-user.helper.js";
import deleteUserDependencies from "../controller-helper/delete-user.helper.js";
import issueTokenDependencies from "../controller-helper/issue-token.helper.js";
import makeIssueToken from "./issue-token.js";

const userController = Object.freeze({
  postUser: makePostUser(postUserDependencies),
  loginUser: makeLoginUser({ authenticateUser, ...loginUserDependencies }),
  deleteUser: makeDeleteUser({ removeUser, ...deleteUserDependencies }),
  verifyUser,
  issueToken: makeIssueToken(issueTokenDependencies),

  getUser: makeGetUser({ findUser }),
  notFound,
  patchUserName: makePatchUserName({ editUserName }),
  patchUserPassword: makePatchUserPassword({ editUserPassword }),
});

export default userController;
