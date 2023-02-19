import usersDb from "../data-access";
import makeAddUser from "./add-user";
import makeDeleteUser from "./delete-user";
import makeEditUserName from "./edit-user-name";
import makeEditUserPassword from "./edit-user-password";

const addUser = makeAddUser({ usersDb });
const editUserName = makeEditUserName({ usersDb });
const editUserPassword = makeEditUserPassword({ usersDb });
const deleteUser = makeDeleteUser({ usersDb });

const userService = Object.freeze({
	addUser,
	editUserName,
	editUserPassword,
	deleteUser,
});

export default userService;
