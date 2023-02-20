import {
	addUser,
	editUserName,
	editUserPassword,
	findUser,
	removeUser,
} from "../use-cases";
import makeGetUser from "../use-cases/find-user";
import makeDeleteUser from "./delete-user";
import notFound from "./not-found";
import makePatchUserName from "./patch-user-name";
import makePatchUserPassword from "./patch-user-password";
import makePostUser from "./post-user";

const deleteUser = makeDeleteUser({ removeUser });
const getUser = makeGetUser({ findUser });
const postUser = makePostUser({ addUser });
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
