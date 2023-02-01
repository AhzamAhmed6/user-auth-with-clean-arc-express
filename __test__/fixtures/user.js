import bcrypt from "bcrypt";

export default function makeFakeUser(overrides) {
	const user = {
		firstName: "Ahzam",
		lastName: "Ahmed",
		email: "ahzamahmed6@gmail.com",
		password: "Abced1234%$#@&^",
	};

	return {
		...user,
		...overrides,
	};
}
