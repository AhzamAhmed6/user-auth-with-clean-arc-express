import makeDb from "../../__test__/fixtures/db";
import makeFakeUser from "../../__test__/fixtures/user";
import makeUsersDb from "../data-access/user-db";
import makeAddUser from "./add-user";
import makeEditUserPassword from "./edit-user-password";
import handlePassword from "../password";

describe("edit user password", () => {
  let usersDb;
  beforeAll(() => (usersDb = makeUsersDb({ makeDb })));

  it("must include an id", async () => {
    const editUserPassword = makeEditUserPassword({
      usersDb,
      verifyPassword: handlePassword.verifyPassword,
    });
    const userToEdit = makeFakeUser({
      id: undefined,
      oldPassword: "1234",
      newPassword: "12345",
    });
    await expect(editUserPassword(userToEdit)).rejects.toThrow(
      "You must supply an id."
    );
  });

  it("must include an old and new password", async () => {
    const editUserPassword = makeEditUserPassword({
      usersDb,
      verifyPassword: handlePassword.verifyPassword,
    });
    const userToEdit = makeFakeUser();
    await expect(editUserPassword(userToEdit)).rejects.toThrow(
      "You must supply old and new password."
    );
  });

  it("user not found", async () => {
    const editUserPassword = makeEditUserPassword({
      usersDb,
      verifyPassword: handlePassword.verifyPassword,
    });
    const userToEdit = makeFakeUser({
      oldPassword: "oldPassword",
      newPassword: "newPassword",
    });
    await expect(editUserPassword(userToEdit)).rejects.toThrow(
      "User not found."
    );
  });

  it("wrong old password", async () => {
    const editUserPassword = makeEditUserPassword({
      usersDb,
      verifyPassword: handlePassword.verifyPassword,
    });

    const fakeUser = makeFakeUser();

    const addUser = makeAddUser({ usersDb });
    const inserted = await addUser(fakeUser);
    inserted.oldPassword = "Old-Password";
    inserted.newPassword = "New-Password";

    await expect(editUserPassword(inserted)).rejects.toThrow(
      "Wrong Old Password."
    );
  });

  it("Password change success", async () => {
    // ------------Insert User in DB----------
    const fakeUser = makeFakeUser();

    const addUser = makeAddUser({ usersDb });
    const inserted = await addUser(fakeUser);

    // ------------Change user's new Password--------

    inserted.oldPassword = fakeUser.password;
    inserted.newPassword = fakeUser.password + "ahzam";

    // ------------Change User password in DB----------

    const editUserPassword = makeEditUserPassword({
      usersDb,
      verifyPassword: handlePassword.verifyPassword,
    });

    await editUserPassword(inserted);
    await expect(editUserPassword(inserted)).rejects.toThrow(
      "Wrong Old Password."
    );
  });
});
