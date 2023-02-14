import makeEditUserName from "./edit-user-name";
import makeFakeUser from "../../__test__/fixtures/user";
import makeUsersDb from "../data-access/user-db";
import makeDb from "../../__test__/fixtures/db";

describe("edit user", () => {
	let usersDb;
	beforeAll(() => (usersDb = makeUsersDb({ makeDb })));

	it("must include an id", async () => {
		const editUserName = makeEditUserName({ usersDb });
		const userToEdit = makeFakeUser({ id: undefined });
		await expect(editUserName(userToEdit)).rejects.toThrow(
			"You must supply an id."
		);
	});

	it("must include first names", async () => {
		const editUserName = makeEditUserName({ usersDb });
		let userToEdit = makeFakeUser({ firstName: undefined });
		await expect(editUserName(userToEdit)).rejects.toThrow(
			"You must supply first name and last name"
		);
		userToEdit = makeFakeUser({ lastName: undefined });
		await expect(editUserName(userToEdit)).rejects.toThrow(
			"You must supply first name and last name"
		);
		userToEdit = makeFakeUser({
			firstName: undefined,
			lastName: undefined,
		});
		await expect(editUserName(userToEdit)).rejects.toThrow(
			"You must supply first name and last name"
		);
	});
});
