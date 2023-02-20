import usersDb from "../data-access/index.js";
import makeAddUser from "./add-user.js";
import makeRemoveUser from "./remove-user.js";
import makeEditUserName from "./edit-user-name.js";
import makeEditUserPassword from "./edit-user-password.js";
import makeFindUser from "./find-user.js";

const addUser = makeAddUser({ usersDb });
const editUserName = makeEditUserName({ usersDb });
const editUserPassword = makeEditUserPassword({ usersDb });
const removeUser = makeRemoveUser({ usersDb });
const findUser = makeFindUser({ usersDb });

const userService = Object.freeze({
	addUser,
	editUserName,
	editUserPassword,
	removeUser,
	findUser,
});

export default userService;
export { addUser, editUserName, editUserPassword, removeUser, findUser };
