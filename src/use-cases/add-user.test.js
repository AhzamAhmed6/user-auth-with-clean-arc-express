import makeAddUser from "./add-user";
import makeUsersDb from "../data-access/user-db";
import makeFakeUser from "../../__test__/fixtures/user";
import makeDb from "../../__test__/fixtures/db";
import makeUser from "../user";

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
});
