import findUserDependencies from "../use-case-helper/find-user.helper";
import makeFindUser from "./find-user";

const { validateInput } = findUserDependencies;

describe("find user", () => {
  it("id and email not provided", async () => {
    const findUserById = jest.fn(() => "fakeUser");
    const findUserByEmail = jest.fn(() => null);
    const findUser = makeFindUser({
      validateInput,
      findUserById,
      findUserByEmail,
    });
    await expect(findUser({})).rejects.toThrow("Provide id or email");
  });

  it("find an inserted user by its id", async () => {
    const findUserById = jest.fn(() => "fakeUser");
    const findUserByEmail = jest.fn(() => null);
    const findUser = makeFindUser({
      validateInput,
      findUserById,
      findUserByEmail,
    });
    const user = await findUser({ id: "1234" });
    expect(user).toBe("fakeUser");
  });

  it("find an inserted user by its email", async () => {
    const findUserById = jest.fn(() => null);
    const findUserByEmail = jest.fn(() => {
      throw Error("User not found.");
    });
    const findUser = makeFindUser({
      validateInput,
      findUserById,
      findUserByEmail,
    });
    await expect(findUser({ email: "fakeemail@test.com" })).rejects.toThrow(
      "User not found."
    );
  });

  it("find a user that is not present in DB", async () => {
    const findUserById = jest.fn(() => {
      throw Error("User not found.");
    });
    const findUserByEmail = jest.fn(() => null);
    const findUser = makeFindUser({
      validateInput,
      findUserById,
      findUserByEmail,
    });
    await expect(findUser({ id: "1234" })).rejects.toThrow("User not found.");
  });
});
