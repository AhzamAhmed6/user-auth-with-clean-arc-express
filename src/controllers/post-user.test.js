import makePostUser from "./post-user";

describe("postUser", () => {
  it("should return a success response with the user object and tokens", async () => {
    const mockAddUser = jest.fn(() => ({
      id: "123",
      name: "John Doe",
      email: "johndoe@example.com",
      modifiedOn: new Date(),
    }));
    const mockMakeTokens = {
      generateToken: jest.fn(() => "token"),
      getExpirationTime: jest.fn(() => 3600),
    };
    const postUser = makePostUser({
      addUser: mockAddUser,
      makeTokens: mockMakeTokens,
    });
    const httpRequest = {
      body: {
        id: "123",
        name: "John Doe",
        email: "johndoe@example.com",
        password: "password",
      },
    };
    const expectedAccessTokenExpTimeInSeconds = 3600;
    const expectedRefreshTokenExpTimeInSeconds = 3600;
    const expectedResponse = {
      headers: {
        "Content-Type": "application/json",
        "Last-Modified": new Date().toUTCString(),
      },
      statusCode: 201,
      body: {
        success: true,
        user: {
          id: "123",
          name: "John Doe",
          email: "johndoe@example.com",
          modifiedOn: expect.any(Date),
        },
        tokens: {
          access: {
            token: "token",
            expiresIn: expectedAccessTokenExpTimeInSeconds,
          },
          refresh: {
            token: "token",
            expiresIn: expectedRefreshTokenExpTimeInSeconds,
          },
        },
      },
    };
    const actualResponse = await postUser(httpRequest);
    expect(actualResponse).toEqual(expectedResponse);
  });

  it("should return a failure response with an error message", async () => {
    const mockAddUser = jest.fn(() => {
      throw new Error("Failed to add user.");
    });
    const mockMakeTokens = {
      generateToken: jest.fn(() => "token"),
      getExpirationTime: jest.fn(() => 3600),
    };
    const postUser = makePostUser({
      addUser: mockAddUser,
      makeTokens: mockMakeTokens,
    });
    const httpRequest = {
      body: {},
    };
    const expectedResponse = {
      headers: {
        "Content-Type": "application/json",
      },
      statusCode: 400,
      body: {
        success: false,
        error: "Failed to add user.",
      },
    };
    const actualResponse = await postUser(httpRequest);
    expect(actualResponse).toEqual(expectedResponse);
  });
});
