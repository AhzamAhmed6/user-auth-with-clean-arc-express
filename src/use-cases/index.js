import usersDb from "../data-access";
import makeAddUser from "./add-user";
import makeRemoveUser from "./remove-user";
import makeEditUserName from "./edit-user-name";
import makeEditUserPassword from "./edit-user-password";
import makeFindUser from "./find-user";

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
