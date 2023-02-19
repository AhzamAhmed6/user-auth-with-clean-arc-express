import makeDb from "../../__test__/fixtures/db";
import makeFakeUser from "../../__test__/fixtures/user";
import makeUsersDb from "../data-access/user-db";
import makeAddUser from "./add-user";
import makeFindUser from "./find-user";

describe("find user", () => {
	let usersDb;
	beforeAll(() => (usersDb = makeUsersDb({ makeDb })));

	it("find user that doesnt inserted in Db", async () => {
		const fakeUser = makeFakeUser();
		const findUser = makeFindUser({ usersDb });

		await expect(findUser(fakeUser)).rejects.toThrow("User not found.");
	});

	it("find the inserted user by its id", async () => {
		//------Insert User In Db-------------
		const fakeUser = makeFakeUser();
		const addUser = makeAddUser({ usersDb });
		await addUser(fakeUser);
		const id = fakeUser.id;

		//------Find User In Db-------------
		const findUser = makeFindUser({ usersDb });
		const user = await findUser({ id });

		delete user.hashedPassword;
		delete fakeUser.password;

		expect(user).toMatchObject(fakeUser);
	});

	it("find the inserted user by its email", async () => {
		//------Insert User In Db-------------
		const fakeUser = makeFakeUser();
		const addUser = makeAddUser({ usersDb });
		await addUser(fakeUser);
		const email = fakeUser.email;

		//------Find User In Db-------------
		const findUser = makeFindUser({ usersDb });
		const user = await findUser({ email });

		delete user.hashedPassword;
		delete fakeUser.password;

		expect(user).toMatchObject(fakeUser);
	});
});
