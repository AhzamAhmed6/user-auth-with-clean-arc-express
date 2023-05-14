import usersDb from "../data-access/index.js";
import makeUser from "../user/index.js";
import makeAddUser from "./add-user.js";
import makeAuthenticateUser from "./authenticate-user.js";
import makeEditUserName from "./edit-user-name.js";
import makeEditUserPassword from "./edit-user-password.js";
import makeFindUser from "./find-user.js";
import makeRemoveUser from "./remove-user.js";
import addUserDependencies from "../helper/add-user.helper.js";
import authenticateUserDependencies from "../helper/authenticate-user.helper.js";
import findUserDependencies from "../helper/find-user.helper.js";

const addUser = makeAddUser({ makeUser, ...addUserDependencies });
const authenticateUser = makeAuthenticateUser(authenticateUserDependencies);
const findUser = makeFindUser(findUserDependencies);
const editUserName = makeEditUserName({ usersDb });
const editUserPassword = makeEditUserPassword({ usersDb });
const removeUser = makeRemoveUser({ usersDb });

const userService = Object.freeze({
  addUser,
  authenticateUser,
  editUserName,
  editUserPassword,
  removeUser,
  findUser,
});

export default userService;
export {
  addUser,
  authenticateUser,
  editUserName,
  editUserPassword,
  findUser,
  removeUser,
};
