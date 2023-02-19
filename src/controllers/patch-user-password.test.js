import makeFakeUser from "../../__test__/fixtures/user";
import makePatchUserPassword from "./patch-user-password";

describe("patch user names controller", () => {
	it("successfully patch a user name", async () => {
		const fakeUser = makeFakeUser();
		const patchUserPassword = makePatchUserPassword({
			editUserPassword: (c) => c,
		});
		const request = {
			headers: {
				"Content-Type": "application/json",
			},
			params: {
				id: fakeUser.id,
			},
			body: fakeUser,
		};
		const expected = {
			headers: {
				"Content-Type": "application/json",
				"Last-Modified": new Date(fakeUser.modifiedOn).toUTCString(),
			},
			statusCode: 200,
			body: { patched: request.body },
		};
		const actual = await patchUserPassword(request);
		expect(actual).toEqual(expected);
	});
});
