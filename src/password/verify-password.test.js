import buildVerifyPassword from "./verify-password";
import bcrypt from "bcrypt";

describe("verifyPassword", () => {
  const plaintextPassword = "password123";
  const hashedPassword = bcrypt.hashSync(plaintextPassword, 10);
  const verifyPassword = buildVerifyPassword({ bcrypt });

  it("should return true for matching password and hash", async () => {
    const isMatch = await verifyPassword({
      password: plaintextPassword,
      hashedPassword,
    });
    expect(isMatch).toBe(true);
  });

  it("should return false for non-matching password and hash", async () => {
    const isMatch = await verifyPassword({
      password: "wrongpassword",
      hashedPassword,
    });
    expect(isMatch).toBe(false);
  });

  it("should return false when bcrypt throws an error", async () => {
    const mockBcrypt = {
      compareSync: jest.fn().mockRejectedValue(new Error("Bcrypt error")),
    };
    const verifyPasswordWithMockBcrypt = buildVerifyPassword({
      bcrypt: mockBcrypt,
    });
    const isMatch = await verifyPasswordWithMockBcrypt({
      password: plaintextPassword,
      hashedPassword,
    });
    expect(isMatch).toBe(false);
  });
});
