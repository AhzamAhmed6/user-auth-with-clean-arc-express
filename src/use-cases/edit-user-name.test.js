import makeEditUserName from "./edit-user-name";
import makeFakeUser from "../../__test__/fixtures/user";
import makeUsersDb from "../data-access/user-db";
import makeDb from "../../__test__/fixtures/db";

describe("edit user", () => {
	let usersDb;
	beforeAll(() => (usersDb = makeUsersDb({ makeDb })));

	it("must include an id", async () => {
		const editUserName = makeEditUserName({ usersDb });
		const userToEdit = makeFakeUser();
		userToEdit.id = undefined;
		console.log(
			"🚀 ~ file: edit-user-name.test.js:14 ~ it ~ userToEdit",
			userToEdit
		);
		expect(async () => await editUserName(userToEdit)).toThrow(Error);
	});
});
