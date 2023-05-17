import makeFakeUser from "../../__test__/fixtures/user";
import makeUser from "../../src/user";
import authenticateUserDependencies from "../../src/use-case-helper/authenticate-user.helper.js";
import makeAuthenticateUser from "../../src/use-cases/authenticate-user";

const { matchPassword, handleError } = authenticateUserDependencies;

describe("authenticate user", () => {
  it("check the respones if password matched successfully", async () => {
    const fakeUser = makeFakeUser();
    const fakeMakedUser = makeUser(fakeUser);
    const fakeInsertedUser = {
      id: fakeMakedUser.getId(),
      firstName: fakeMakedUser.getFirstName(),
      lastName: fakeMakedUser.getLastName(),
      email: fakeMakedUser.getEmail(),
      modifiedOn: fakeMakedUser.getModifiedOn(),
      createdOn: fakeMakedUser.getCreatedOn(),
      hashedPassword: await fakeMakedUser.getHashedPassword(),
    };
    const checkUserExists = jest.fn(() => fakeInsertedUser);
    const authenticateUser = makeAuthenticateUser({
      checkUserExists,
      matchPassword,
      handleError,
    });
    expect(
      await authenticateUser({
        email: fakeUser.email,
        password: fakeUser.password,
      })
    ).toMatchObject(fakeInsertedUser);
  });

  it("check the respones if password didnt match", async () => {
    const fakeUser = makeFakeUser();
    const fakeMakedUser = makeUser(fakeUser);
    const fakeInsertedUser = {
      id: fakeMakedUser.getId(),
      firstName: fakeMakedUser.getFirstName(),
      lastName: fakeMakedUser.getLastName(),
      email: fakeMakedUser.getEmail(),
      modifiedOn: fakeMakedUser.getModifiedOn(),
      createdOn: fakeMakedUser.getCreatedOn(),
      hashedPassword: await fakeMakedUser.getHashedPassword(),
    };
    const checkUserExists = jest.fn(() => fakeInsertedUser);
    const authenticateUser = makeAuthenticateUser({
      checkUserExists,
      matchPassword,
      handleError,
    });
    await expect(
      authenticateUser({ email: fakeUser.email, password: "12345" })
    ).rejects.toThrow("Incorrect password. Please try again.");
  });

  it("check the respones if user not found", async () => {
    const fakeUser = makeFakeUser();
    const checkUserExists = jest.fn(() => {
      throw new "User not found. Please check the provided details and try again."();
    });
    const authenticateUser = makeAuthenticateUser({
      checkUserExists,
      matchPassword,
      handleError,
    });
    await expect(
      authenticateUser({ email: fakeUser.email, password: fakeUser.password })
    ).rejects.toThrow(
      "User not found. Please check the provided details and try again."
    );
  });
});
