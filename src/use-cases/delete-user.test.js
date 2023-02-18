import makeFakeUser from "../../__test__/fixtures/user";
import makeUserDb from "../data-access/user-db";
import makeAddUser from "./add-user";
import addUser from "./add-user";
import makeDeleteUser from "./delete-user";
import makeDb from "../../__test__/fixtures/db";

describe("delete User", () => {
  let usersDb;
  beforeAll(() => (usersDb = makeUserDb({ makeDb })));
  it("delete an inserted user from Db", async () => {
    // -----------Add User------------------
    const fakeUser1 = makeFakeUser();
    const fakeUser2 = makeFakeUser();

    const addUser = makeAddUser({ usersDb });

    const inserted1 = await addUser(fakeUser1);
    const inserted2 = await addUser(fakeUser2);

    //-----------Delete User----------------
    const deleteUser = makeDeleteUser({ usersDb });
    //const deleted1 = await deleteUser(inserted1);
    //console.log("deleted1====>", deleted1);
    await expect(deleteUser(inserted1)).resolves.toEqual(1);
    await expect(deleteUser(inserted1)).rejects.toThrow("User not found.");
    await expect(deleteUser(inserted2)).resolves.toEqual(1);
    await expect(deleteUser(inserted2)).rejects.toThrow("User not found.");
  });
});
