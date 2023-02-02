import makeFakeUser from "../../__test__/fixtures/user";
import makeUsersDb from "./user-db";
import makeDb from "../../__test__/fixtures/db";

describe("users db", () => {
	let usersDB;

	beforeEach(async () => {
		usersDB = makeUsersDb({ makeDb });
	});
	it("insert a user", async () => {
		const user = makeFakeUser();
		const result = await usersDB.insert(user);
		expect(result).toEqual(user);
		result.amazing = true;
		expect(result).not.toEqual(user);
	});
});

/**
 * Here we are just testing the database's insert functionality in which no password hashing is includes
 * In AddUser use case, we are testing the Password Hashing functionality
 */
