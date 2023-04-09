import makeFakeUser from "../../__test__/fixtures/user";
import makeUser from "./";
import handlePassword from "../password";

describe("user", () => {
  const completeUser = makeFakeUser();
  const incompleteFields = ["firstName", "lastName", "email", "password"];

  incompleteFields.forEach((field) => {
    test(`incomplete ${field}`, () => {
      const user = makeFakeUser({ ...completeUser, [field]: undefined });

      expect(() => makeUser(user)).toThrow(
        "Please provide complete information"
      );

      user[field] = "";
      expect(() => makeUser(user)).toThrow(
        "Please provide complete information"
      );
    });
  });

  test("invalid email", () => {
    const user = makeFakeUser({ email: "ahzamahmed6gmail.com" });

    expect(() => makeUser(user)).toThrow(
      "ahzamahmed6gmail.com is not a valid email"
    );
  });

  test("unsatisfied password", () => {
    const user = makeFakeUser({ password: "1234" });

    expect(() => makeUser(user)).toThrow(
      "Password must contains min 8 letter password, with at least a symbol, upper and lower case letters and a number"
    );
  });

  test("verify hashed password", async () => {
    const fakeUser = makeFakeUser();
    const fakeUserPassword = fakeUser.password;
    const user = makeUser(fakeUser);

    const isMatch = await handlePassword.verifyPassword({
      password: fakeUserPassword,
      hashedPassword: await user.getHashedPassword(),
    });

    expect(isMatch).toBe(true);
  });

  test("Everything Correct", () => {
    for (let i = 0; i <= 10; i++) {
      makeUser(makeFakeUser());
    }
  });
  test("is modifiedOn now in UTC", () => {
    const noModifiedOnDate = makeFakeUser({ modifiedOn: undefined });
    expect(noModifiedOnDate.modifiedOn).not.toBeDefined();
    const d = makeUser(noModifiedOnDate).getCreatedOn();
    expect(d).toBeDefined();
    expect(new Date(d).toUTCString().substring(26)).toBe("GMT");
  });
});
