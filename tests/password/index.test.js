import handlePassword from "../../src/password/index";

describe("handlePassword", () => {
  const password = "password";
  let hashedPassword;

  it("hashes the password correctly", async () => {
    hashedPassword = await handlePassword.hashPassword({ password });
    expect(typeof hashedPassword).toBe("string");
    expect(hashedPassword.length).toBeGreaterThan(0);
  });

  it("verifies the correct password", async () => {
    const isMatch = await handlePassword.verifyPassword({
      password,
      hashedPassword,
    });
    expect(isMatch).toBe(true);
  });

  it("does not verify the incorrect password", async () => {
    const isMatch = await handlePassword.verifyPassword(
      "wrongPassword",
      hashedPassword
    );
    expect(isMatch).toBe(false);
  });
});
