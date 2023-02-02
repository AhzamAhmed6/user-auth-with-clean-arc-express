import makeUser from "../user";

export default function makeAddUser({ usersDb }) {
	return async function addUser(userInfo) {
		const user = makeUser(userInfo);
		const exists = await usersDb.findByEmail({ email: user.getEmail() });
		if (exists) {
			return exists;
		}
		return usersDb.insert({
			firstName: user.getFirstName(),
			lastName: user.getLastName(),
			email: user.getEmail(),
			hashedpassword: user.getHashedPassword(),
		});
	};
}
