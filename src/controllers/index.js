import {
  addUser,
  editUserName,
  editUserPassword,
  findUser,
  removeUser,
} from "../use-cases/index.js";
import makeGetUser from "./get-user.js";
import makeDeleteUser from "./delete-user.js";
import notFound from "./not-found.js";
import makePatchUserName from "./patch-user-name.js";
import makePatchUserPassword from "./patch-user-password.js";
import makePostUser from "./post-user.js";
import makeTokens from "../tokens/index.js";

const deleteUser = makeDeleteUser({ removeUser });
const getUser = makeGetUser({ findUser });
const postUser = makePostUser({ addUser, makeTokens });
const patchUserName = makePatchUserName({ editUserName });
const patchUserPassword = makePatchUserPassword({ editUserPassword });

const userController = Object.freeze({
  deleteUser,
  getUser,
  postUser,
  patchUserName,
  patchUserPassword,
  notFound,
});

export default userController;
export {
  deleteUser,
  getUser,
  postUser,
  patchUserName,
  patchUserPassword,
  notFound,
};
