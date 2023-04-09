import usersDb from "../data-access/index.js";
import makeAddUser from "./add-user.js";
import makeRemoveUser from "./remove-user.js";
import makeEditUserName from "./edit-user-name.js";
import makeEditUserPassword from "./edit-user-password.js";
import makeFindUser from "./find-user.js";
import handlePassword from "../password/index.js";
import makeAuthenticateUser from "./authenticate-user.js";

const addUser = makeAddUser({ usersDb });
const authenticateUser = makeAuthenticateUser({
  usersDb,
  verifyPassword: handlePassword.verifyPassword,
});
const editUserName = makeEditUserName({ usersDb });
const editUserPassword = makeEditUserPassword({ usersDb });
const removeUser = makeRemoveUser({ usersDb });
const findUser = makeFindUser({ usersDb });

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
  removeUser,
  findUser,
};
