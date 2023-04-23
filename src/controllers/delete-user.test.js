import makePostUser from "./post-user";
import makeFakeUser from "../../__test__/fixtures/user";
import makeDeleteUser from "./delete-user";

describe("Delete User Controller", () => {
  it("Delete an inserted user", async () => {
    const user = makeFakeUser();
    const deleteRequest = {
      query: {
        id: user.id,
      },
    };
    const deleteUser = makeDeleteUser({ removeUser: (c) => c });
    const actual = await deleteUser(deleteRequest);

    const expected = {
      headers: { "Content-Type": "application/json" },
      statusCode: 200,
      body: { message: "User deleted successfully", success: true },
    };

    expect(actual).toEqual(expected);
  });

  it("Delete user, not present in Db", async () => {
    const user = makeFakeUser();
    const deleteRequest = {
      query: {
        id: user.id,
      },
    };
    const deleteUser = makeDeleteUser({
      removeUser: () => {
        throw new Error("User not found.");
      },
    });
    const actual = await deleteUser(deleteRequest);

    const expected = {
      headers: { "Content-Type": "application/json" },
      statusCode: 400,
      body: { error: "User not found.", success: false },
    };

    expect(actual).toEqual(expected);
  });
});
