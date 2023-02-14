import makeEditUserName from "./edit-user-name";
import makeFakeUser from "../../__test__/fixtures/user";
import makeUsersDb from "../data-access/user-db";
import makeDb from "../../__test__/fixtures/db";

describe("edit user", () => {
	let usersDb;
	beforeAll(() => (usersDb = makeUsersDb({ makeDb })));

	it("must include an id", async () => {
		const editUserName = makeEditUserName({
			usersDb: {
				update: () => {
					throw new Error("update should not have been called");
				},
			},
		});
		const userToEdit = makeFakeUser({ id: undefined });
		await expect(editUserName(userToEdit)).rejects.toThrow(
			"You must supply an id."
		);
	});
});
