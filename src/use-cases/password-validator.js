import bcrypt from "bcrypt";

export default async function passwordValidator({
	oldPassword,
	oldHashedPassword,
}) {
	return await bcrypt.compare(oldPassword, oldHashedPassword);
}
