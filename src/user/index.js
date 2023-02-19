import bcrypt from "bcrypt";
import Id from "../Id";
import buildMakeUser from "./user";

const makeUser = buildMakeUser({ Id, hashPassword });

export default makeUser;

function hashPassword(password) {
	const salt = bcrypt.genSaltSync(10);
	return bcrypt.hashSync(password, salt);
}
