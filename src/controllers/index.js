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
import makePatchUserName from "./patch-user-name.js";
import makePatchUserPassword from "./patch-user-password.js";
import makePostUser from "./post-user.js";
import notFound from "./not-found.js";

const userController = Object.freeze({
  postUser: makePostUser({
    addUser,
    ...makeTokens,
  }),
  loginUser: makeLoginUser({
    authenticateUser,
    ...makeTokens,
  }),
  deleteUser: makeDeleteUser({ removeUser }),
  getUser: makeGetUser({ findUser }),

  notFound,
  patchUserName: makePatchUserName({ editUserName }),
  patchUserPassword: makePatchUserPassword({ editUserPassword }),
});

export default userController;
