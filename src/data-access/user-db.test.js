import makeFakeUser from "../../__test__/fixtures/user";
import makeUsersDb from "./user-db";
import makeDb from "../../__test__/fixtures/db";

describe("users db", () => {
	let usersDb;

	beforeEach(async () => {
		usersDb = makeUsersDb({ makeDb });
	});
	it("insert a user", async () => {
		const user = makeFakeUser();
		const result = await usersDb.insert(user);
		expect(result).toEqual(user);
		result.amazing = true;
		expect(result).not.toEqual(user);
	});
	it("find a user by its email", async () => {
		const fakeUserOne = makeFakeUser();
		const fakeUserTwo = makeFakeUser();

		const insertedOne = await usersDb.insert(fakeUserOne);
		const insertedTwo = await usersDb.insert(fakeUserTwo);

		insertedOne["id"] = insertedOne["_id"];
		delete insertedOne["_id"];

		insertedTwo["id"] = insertedTwo["_id"];
		delete insertedTwo["_id"];

		expect(await usersDb.findByEmail(fakeUserOne)).toEqual(insertedOne);
		expect(await usersDb.findByEmail(fakeUserTwo)).toEqual(insertedTwo);
	});
});

/**
 * Here we are just testing the database's insert functionality in which no password hashing is includes
 * In AddUser use case, we are testing the Password Hashing functionality
 */
