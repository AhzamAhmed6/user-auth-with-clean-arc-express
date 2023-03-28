import buildMakeTokens from "./tokens";

describe("buildMakeTokens", () => {
  const jwt = {
    sign: jest.fn(),
    verify: jest.fn(),
  };
  const makeTokens = buildMakeTokens({ jwt });

  it("should generate a token", async () => {
    const payload = { id: "123" };
    const tokenKey = "secret";
    const tokenExpTime = "1h";
    jwt.sign.mockReturnValueOnce("token");
    const token = await makeTokens.generateToken({
      payload,
      tokenKey,
      tokenExpTime,
    });
    expect(jwt.sign).toHaveBeenCalledWith(payload, tokenKey, {
      expiresIn: tokenExpTime,
    });
    expect(token).toBe("token");
  });

  it("should verify a token", async () => {
    const token = "token";
    const tokenKey = "secret";
    jwt.verify.mockReturnValueOnce({ id: "123" });
    const payload = await makeTokens.verifyToken({ token, tokenKey });
    expect(jwt.verify).toHaveBeenCalledWith(token, tokenKey);
    expect(payload).toEqual({ id: "123" });
  });

  it("should return the expiration time of a token", async () => {
    const tokenExpTime = "1h";
    const expirationTime = await makeTokens.getExpirationTime({
      tokenExpTime,
    });
    expect(expirationTime).toBeGreaterThan(0);
  });
});
