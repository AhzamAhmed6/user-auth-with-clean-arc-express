import makeFakeUser from "../../__test__/fixtures/user";
import makeAddUser from "./add-user";
import makeUser from "../user";
import addUserDependencies from "../helper/add-user.helper";

const { formatUser, handleError } = addUserDependencies;

describe("add user", () => {
  it("inserts users in the database", async () => {
    const checkUserExists = jest.fn(() => null);
    const insertUser = jest.fn((userInfo) => userInfo);

    const fakeUser = makeFakeUser();
    const addUser = makeAddUser({
      makeUser,
      checkUserExists,
      formatUser,
      insertUser,
      handleError,
    });
    const inserted = await addUser(fakeUser);
    delete inserted.hashedPassword;
    delete fakeUser.password;

    expect(inserted).toMatchObject(fakeUser);
  });

  it("users already present in the database", async () => {
    const checkUserExists = jest.fn(() => {
      throw new Error(
        "Unable to register user. The provided email address is already associated with an existing account."
      );
    });
    const insertUser = jest.fn((userInfo) => userInfo);

    const addUser = makeAddUser({
      makeUser,
      checkUserExists,
      formatUser,
      insertUser,
      handleError,
    });

    const fakeUser = makeFakeUser();

    await expect(addUser(fakeUser)).rejects.toThrow(
      "Unable to register user. The provided email address is already associated with an existing account."
    );
  });
});
