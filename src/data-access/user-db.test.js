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
		expect(await usersDb.findByEmail(fakeUserOne)).toEqual(insertedOne);
		expect(await usersDb.findByEmail(fakeUserTwo)).toEqual(insertedTwo);
	});
	it("delete a user", async () => {
		const user = makeFakeUser();
		const insertedUser = await usersDb.insert(user);
		return expect(await usersDb.remove(insertedUser)).toBe(1);
	});
	it("lists users", async () => {
		const inserts = await Promise.all(
			[makeFakeUser(), makeFakeUser(), makeFakeUser()].map(usersDb.insert)
		);
		const found = await usersDb.findAll();
		expect.assertions(inserts.length);
		return inserts.forEach((insert) =>
			expect(found).toContainEqual(insert)
		);
	});
	it("update first and last names", async () => {
		const user = makeFakeUser();
		const email = user.email;

		await usersDb.insert(user);

		// update firstName
		user.firstName = "Ahzam";
		var updated = await usersDb.updateName(user);
		expect(updated.firstName).toBe("Ahzam");

		// update lastName
		user.lastName = "Ahmed";
		updated = await usersDb.updateName(user);
		expect(updated.firstName).toBe("Ahzam");
		expect(updated.lastName).toBe("Ahmed");

		// update everything
		user.email = "ahzamahmed6@gmail.com";
		user.firstName = "James";
		user.lastName = "Bond";
		user.password = "1234";
		await usersDb.updateName(user);

		updated = await usersDb.findByEmail({ email });

		expect(updated.firstName).toBe("James");
		expect(updated.lastName).toBe("Bond");
		expect(updated.email).not.toBe("ahzamahmed6@gmail.com");
		expect(updated.password).not.toBe("1234");
	});
});

/**
 * Here we are just testing the database's insert functionality in which no password hashing is includes
 * In AddUser use case, we are testing the Password Hashing functionality
 */
