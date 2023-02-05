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
	it("find a user by its email", async () => {
		const fakeUserOne = makeFakeUser();
		const fakeUserTwo = makeFakeUser();
		const insertedOne = await usersDB.insert(fakeUserOne);
		const u1 = await usersDB.findByEmail(fakeUserOne);
		const insertedTwo = await usersDB.insert(fakeUserTwo);

		expect(await usersDB.findByEmail(fakeUserOne)).toEqual(insertedOne);
	});
});

/**
 * Here we are just testing the database's insert functionality in which no password hashing is includes
 * In AddUser use case, we are testing the Password Hashing functionality
 */
