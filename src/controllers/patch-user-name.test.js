import makeFakeUser from "../../__test__/fixtures/user";
import makePatchUserName from "./patch-user-name";

describe("patch user names controller", () => {
  it("successfully patch a user name", async () => {
    const fakeUser = makeFakeUser();
    const patchUserName = makePatchUserName({ editUserName: (c) => c });
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
    const actual = await patchUserName(request);
    expect(actual).toEqual(expected);
  });
  it("reports user errors", async () => {
    const fakeUser = makeFakeUser();
    const patchUser = makePatchUserName({
      editUserName: () => {
        throw Error("User not found.");
      },
    });
    const request = {
      headers: { "Content-Type": "application/json" },
      params: {
        id: fakeUser.id,
      },
      body: fakeUser,
    };
    const expected = {
      headers: {
        "Content-Type": "application/json",
      },
      statusCode: 400,
      body: { error: "User not found." },
    };
    const actual = await patchUser(request);
    expect(actual).toEqual(expected);
  });
});
