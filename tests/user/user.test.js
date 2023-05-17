import makeFakeUser from "../../__test__/fixtures/user";
import handlePassword from "../../src/password";
import makeUser from "../../src/user";

describe("user", () => {
  const completeUser = makeFakeUser();
  const incompleteFields = ["firstName", "lastName", "email", "password"];

  incompleteFields.forEach((field) => {
    test(`incomplete ${field}`, () => {
      const user = makeFakeUser({ ...completeUser, [field]: undefined });

      expect(() => makeUser(user)).toThrow(
        "All fields are required. Please provide complete information for the user"
      );

      user[field] = "";
      expect(() => makeUser(user)).toThrow(
        "All fields are required. Please provide complete information for the user"
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
      "The password must be at least 8 characters long and include at least one symbol, uppercase letter, lowercase letter, and number."
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
