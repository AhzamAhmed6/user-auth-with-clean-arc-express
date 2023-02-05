import faker from "faker";

export default function makeFakeUser(overrides) {
	const user = {
		firstName: faker.name.firstName(),
		lastName: faker.name.lastName(),
		email: faker.internet.email(),
		password:
			faker.internet.password() + "+-$1@#" + faker.internet.password(),
	};

	return {
		...user,
		...overrides,
	};
}
