import makeEditUserName from "./edit-user-name";
import makeAddUser from "./add-user";
import makeFakeUser from "../../__test__/fixtures/user";
import makeUsersDb from "../data-access/user-db";
import makeDb from "../../__test__/fixtures/db";

describe("edit user names", () => {
  let usersDb;
  beforeAll(() => (usersDb = makeUsersDb({ makeDb })));

  it("must include an id", async () => {
    const editUserName = makeEditUserName({ usersDb });
    const userToEdit = makeFakeUser({ id: undefined });
    await expect(editUserName(userToEdit)).rejects.toThrow(
      "You must supply an id."
    );
  });

  it("must include first and last names", async () => {
    const editUserName = makeEditUserName({ usersDb });
    let userToEdit = makeFakeUser({ firstName: undefined });
    await expect(editUserName(userToEdit)).rejects.toThrow(
      "You must supply first name and last name."
    );
    userToEdit = makeFakeUser({ lastName: undefined });
    await expect(editUserName(userToEdit)).rejects.toThrow(
      "You must supply first name and last name."
    );
    userToEdit = makeFakeUser({
      firstName: undefined,
      lastName: undefined,
    });
    await expect(editUserName(userToEdit)).rejects.toThrow(
      "You must supply first name and last name."
    );
  });

  it("user not found", async () => {
    const editUserName = makeEditUserName({ usersDb });
    const userToEdit = makeFakeUser();
    await expect(editUserName(userToEdit)).rejects.toThrow("User not found.");
  });

  it("change first and last name", async () => {
    const fakeUser = makeFakeUser();
    const addUser = makeAddUser({ usersDb });
    const inserted = await addUser(fakeUser);
    inserted.firstName = "Ahzam";
    inserted.lastName = "Ahmed";
    const editUserName = makeEditUserName({ usersDb });
    const userAfterEdit = await editUserName(inserted);
    expect(userAfterEdit).not.toBe(inserted);
    expect(userAfterEdit.firstName).toBe("Ahzam");
    expect(userAfterEdit.lastName).toBe("Ahmed");
  });
});
