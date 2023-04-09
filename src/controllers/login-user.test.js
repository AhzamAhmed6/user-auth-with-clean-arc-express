import makeLoginUser from "./login-user";

describe("loginUser", () => {
  test("makeLoginUser returns a success response when given valid user credentials", async () => {
    // Arrange
    const authenticateUser = jest
      .fn()
      .mockResolvedValue({ id: 1, email: "test@example.com" });
    const generateToken = jest.fn().mockResolvedValue("access_token");
    const getExpirationTime = jest.fn().mockResolvedValue(3600);

    const httpRequest = {
      body: {
        username: "test",
        password: "password123",
      },
    };

    const expectedResponse = {
      headers: {
        "Content-Type": "application/json",
      },
      statusCode: 201,
      body: {
        success: true,
        user: {
          id: 1,
          email: "test@example.com",
        },
        tokens: {
          access: {
            token: "access_token",
            issuedAt: new Date(Date.now()).toUTCString(),
            expiresIn: 3600,
          },
          refresh: {
            token: expect.any(String),
            issuedAt: new Date(Date.now()).toUTCString(),
            expiresIn: expect.any(Number),
          },
        },
      },
    };

    // Act
    const loginUser = makeLoginUser({
      authenticateUser,
      generateToken,
      getExpirationTime,
    });
    const actualResponse = await loginUser(httpRequest);

    // Assert
    expect(actualResponse).toEqual(expectedResponse);
    expect(authenticateUser).toHaveBeenCalledWith({
      username: "test",
      password: "password123",
    });
    expect(generateToken).toHaveBeenCalledWith({
      payload: { userId: 1, email: "test@example.com" },
      tokenKey: process.env.ACCESS_KEY,
      tokenExpTime: process.env.ACCESS_EXP_TIME,
    });
    expect(getExpirationTime).toHaveBeenCalledWith({
      tokenExpTime: process.env.ACCESS_EXP_TIME,
    });
  });

  test("makeLoginUser returns an error response when given invalid user credentials", async () => {
    // Arrange
    const authenticateUser = jest
      .fn()
      .mockRejectedValue(new Error("Invalid credentials"));
    const generateToken = jest.fn();
    const getExpirationTime = jest.fn();

    const httpRequest = {
      body: {
        username: "test",
        password: "wrongpassword",
      },
    };

    const expectedResponse = {
      headers: {
        "Content-Type": "application/json",
      },
      statusCode: 400,
      body: {
        success: false,
        error: "Invalid credentials",
      },
    };

    // Act
    const loginUser = makeLoginUser({
      authenticateUser,
      generateToken,
      getExpirationTime,
    });
    const actualResponse = await loginUser(httpRequest);

    // Assert
    expect(actualResponse).toEqual(expectedResponse);
    expect(authenticateUser).toHaveBeenCalledWith({
      username: "test",
      password: "wrongpassword",
    });
    expect(generateToken).not.toHaveBeenCalled();
    expect(getExpirationTime).not.toHaveBeenCalled();
  });

  test("loginUser returns 400 status code and error message when authenticateUser throws an error", async () => {
    const expectedErrorMessage = "Invalid credentials";
    const authenticateUser = jest
      .fn()
      .mockRejectedValue(new Error(expectedErrorMessage));
    const generateToken = jest.fn();
    const getExpirationTime = jest.fn();

    const loginUser = makeLoginUser({
      authenticateUser,
      generateToken,
      getExpirationTime,
    });
    const httpRequest = {
      body: { email: "test@example.com", password: "password" },
    };

    const { statusCode, body } = await loginUser(httpRequest);

    expect(statusCode).toBe(400);
    expect(body.success).toBe(false);
    expect(body.error).toBe(expectedErrorMessage);
    expect(authenticateUser).toHaveBeenCalledTimes(1);
    expect(authenticateUser).toHaveBeenCalledWith(httpRequest.body);
    expect(generateToken).not.toHaveBeenCalled();
    expect(getExpirationTime).not.toHaveBeenCalled();
  });
});
