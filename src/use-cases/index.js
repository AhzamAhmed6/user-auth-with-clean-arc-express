import addUserDependencies from "../use-case-helper/add-user.helper.js";
import authenticateUserDependencies from "../use-case-helper/authenticate-user.helper.js";
import editUserNameDependencies from "../use-case-helper/edit-user-name.helper.js";
import editUserPasswordDependencies from "../use-case-helper/edit-user-password.helper.js";
import findUserDependencies from "../use-case-helper/find-user.helper.js";
import removeUserDependencies from "../use-case-helper/remove-user.helper.js";

import makeUser from "../user/index.js";
import makeAddUser from "./add-user.js";
import makeAuthenticateUser from "./authenticate-user.js";
import makeEditUserPassword from "./edit-user-password.js";
import makeEditUserName from "./edit-user-name.js";
import makeFindUser from "./find-user.js";
import makeRemoveUser from "./remove-user.js";

const userService = Object.freeze({
  addUser: makeAddUser({ makeUser, ...addUserDependencies }),
  authenticateUser: makeAuthenticateUser(authenticateUserDependencies),
  findUser: makeFindUser(findUserDependencies),
  removeUser: makeRemoveUser(removeUserDependencies),
  editUserPassword: makeEditUserPassword(editUserPasswordDependencies),
  editUserName: makeEditUserName(editUserNameDependencies),
});

export default userService;
