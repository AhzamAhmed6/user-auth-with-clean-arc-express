import makeDb from "../../__test__/fixtures/db";
import makeFakeUser from "../../__test__/fixtures/user";
import makeUsersDb from "../data-access/user-db";
import makeAddUser from "./add-user";

describe("add user", () => {
  let usersDb;
  beforeAll(() => (usersDb = makeUsersDb({ makeDb })));

  it("inserts users in the database", async () => {
    const fakeUser = makeFakeUser();
    const addUser = makeAddUser({ usersDb });
    const inserted = await addUser(fakeUser);
    delete inserted.hashedPassword;
    delete fakeUser.password;

    expect(inserted).toMatchObject(fakeUser);
  });
  
  it("users already present in the database", async () => {
    var fakeUser = makeFakeUser();
    const addUser = makeAddUser({ usersDb });
    var inserted = await addUser(fakeUser);
    
    fakeUser = makeFakeUser();
    fakeUser.id = inserted.id    
    await expect(addUser(fakeUser)).rejects.toThrow('User already registered')

    fakeUser = makeFakeUser();
    fakeUser.email = inserted.email
    await expect(addUser(fakeUser)).rejects.toThrow('User already registered')
  });
});
