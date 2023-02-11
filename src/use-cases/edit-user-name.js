import makeUser from "../user";
export default function makeEditUserName({ usersDb }) {
	return async function editUserName({
		id,
		firstName,
		lastName,
		...rest
	} = {}) {
		if (!id) {
			throw new Error("You must supply an id.");
		}
		if (!firstName.text && !lastName.text) {
			throw new Error("You must supply first name and last name");
		}
		const existing = await usersDb.findById({ id });

		if (!existing) {
			throw new RangeError("User not found");
		}
		const user = makeUser({ firstName, lastName, ...rest });
		const updated = await usersDb.updateName({
			firstName: user.getFirstName(),
			lastName: user.getLastName(),
			email: user.getEmail(),
			password: user.getHashedPassword(),
		});
		return updated;
	};
}
