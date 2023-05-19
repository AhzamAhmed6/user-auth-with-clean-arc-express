import makeUser from "../user/index.js";
import makeAddUser from "./add-user.js";
import makeAuthenticateUser from "./authenticate-user.js";
import makeFindUser from "./find-user.js";
import makeRemoveUser from "./remove-user.js";

import addUserDependencies from "../use-case-helper/add-user.helper.js";
import authenticateUserDependencies from "../use-case-helper/authenticate-user.helper.js";
import findUserDependencies from "../use-case-helper/find-user.helper.js";
import removeUserDependencies from "../use-case-helper/remove-user.helper.js";

const addUser = makeAddUser({ makeUser, ...addUserDependencies });
const authenticateUser = makeAuthenticateUser(authenticateUserDependencies);
const findUser = makeFindUser(findUserDependencies);
const removeUser = makeRemoveUser(removeUserDependencies);

const userService = Object.freeze({
  addUser,
  authenticateUser,
  removeUser,
  findUser,
});

export default userService;
