import buildMakeUser from "./user.js";
import bcrypt from "bcrypt";

const makeUser = buildMakeUser({ hashPassword });

export default makeUser;

function hashPassword(password) {
	const salt = bcrypt.genSaltSync(10);
	return bcrypt.hashSync(password, salt);
}
