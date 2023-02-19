import makePostUser from "./post-user";
import makeFakeUser from "../../__test__/fixtures/user";

describe("post User controller", () => {
	it("successfully posts a user", async () => {
		const postUser = makePostUser({ addUser: (c) => c });
		const user = makeFakeUser();
		const request = {
			headers: {
				"Content-Type": "application/json",
			},
			body: user,
		};

		const expected = {
			headers: {
				"Content-Type": "application/json",
				"Last-Modified": new Date(request.body.modifiedOn).toUTCString(),
			},
			statusCode: 201,
			body: { posted: request.body },
		};

		const actual = await postUser(request);
		expect(actual).toEqual(expected);
	});

	it("reports user errors", async () => {
		const postUser = makePostUser({
			addUser: () => {
				throw Error("This is Error.");
			},
		});
		const fakeUser = makeFakeUser();
		const request = {
			headers: {
				"Content-Type": "application/json",
			},
			body: fakeUser,
		};
		const expected = {
			headers: { "Content-Type": "application/json" },
			statusCode: 400,
			body: { error: "This is Error." },
		};
		const actual = await postUser(request);
		expect(actual).toEqual(expected);
	});
});
