import buildMakeHashPassword from "../../src/password/hash-password";
import bcrypt from "bcrypt";

describe("makeHashPassword", () => {
  const bcryptSalt = "10";
  const makeHashPassword = buildMakeHashPassword({ bcrypt, bcryptSalt });

  it("should hash password correctly", async () => {
    const password = "password123";
    const hashedPassword = await makeHashPassword({ password });
    const isMatch = await bcrypt.compare(password, hashedPassword);
    expect(isMatch).toBe(true);
  });

  it("should return original password when bcrypt throws error", async () => {
    const password = "password123";
    const mockBcrypt = {
      genSaltSync: jest.fn().mockRejectedValue(new Error("Bcrypt error")),
    };
    const makeHashPasswordWithMockBcrypt = buildMakeHashPassword({
      bcrypt: mockBcrypt,
      bcryptSalt,
    });
    const hashedPassword = await makeHashPasswordWithMockBcrypt({ password });
    expect(hashedPassword).toBe(password);
  });
});
