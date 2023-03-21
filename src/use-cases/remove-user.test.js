import makeDb from "../../__test__/fixtures/db";
import makeFakeUser from "../../__test__/fixtures/user";
import makeUserDb from "../data-access/user-db";
import makeAddUser from "./add-user";
import makeRemoveUser from "./remove-user";

describe("remove User", () => {
  let usersDb;
  beforeAll(() => (usersDb = makeUserDb({ makeDb })));
  it("remove an inserted user from Db", async () => {
    // -----------Add User------------------
    const fakeUser1 = makeFakeUser();
    const fakeUser2 = makeFakeUser();

    const addUser = makeAddUser({ usersDb });

    const inserted1 = await addUser(fakeUser1);
    const inserted2 = await addUser(fakeUser2);

    //-----------Remove User----------------
    const removeUser = makeRemoveUser({ usersDb });

    await expect(removeUser(inserted1)).resolves.toEqual(1);
    await expect(removeUser(inserted1)).rejects.toThrow("User not found.");
    await expect(removeUser(inserted2)).resolves.toEqual(1);
    await expect(removeUser(inserted2)).rejects.toThrow("User not found.");
  });
});
