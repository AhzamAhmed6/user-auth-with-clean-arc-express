import makeUser from "../user";

export default function makeAddUser({ usersDb }) {
	return async function addUser(userInfo) {
		const user = makeUser(userInfo);
		const exists = await usersDb.findById({ id: user.getId() });
		if (exists) {
			return exists;
		}
		return usersDb.insert({
			id: user.getId(),
			firstName: user.getFirstName(),
			lastName: user.getLastName(),
			email: user.getEmail(),
			hashedPassword: user.getHashedPassword(),
		});
	};
}
