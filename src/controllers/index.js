import makeDeleteUser from "./delete-user.js";
import makeLoginUser from "./login-user.js";
import makePostUser from "./post-user.js";
import verifyUser from "./verify-user.js";

import deleteUserDependencies from "../controller-helper/delete-user.helper.js";
import issueTokenDependencies from "../controller-helper/issue-token.helper.js";
import loginUserDependencies from "../controller-helper/login-user.helper.js";
import postUserDependencies from "../controller-helper/post-user.helper.js";
import makeIssueToken from "./issue-token.js";
import userService from "../use-cases/index.js";

const { authenticateUser, removeUser } = userService;

const userController = Object.freeze({
  postUser: makePostUser(postUserDependencies),
  loginUser: makeLoginUser({ authenticateUser, ...loginUserDependencies }),
  deleteUser: makeDeleteUser({ removeUser, ...deleteUserDependencies }),
  verifyUser,
  issueToken: makeIssueToken(issueTokenDependencies),
});

export default userController;
