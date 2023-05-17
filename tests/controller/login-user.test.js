import loginUserDependencies from "../../src/controller-helper/login-user.helper";
import makeLoginUser from "../../src/controllers/login-user";

const { prepareResponseBody, handleError } = loginUserDependencies;

describe("loginUser", () => {
  it("return a login success response", async () => {
    const authenticateUser = jest.fn(() => {
      return {
        id: "cjld2cjxh0006qzrmn831i7rn",
        firstName: "John",
        lastName: "Doe",
        email: "johndoe@example.com",
        createdOn: "Tue, 16 May 2023 12:12:13 GMT",
        modifiedOn: "Tue, 16 May 2023 12:12:13 GMT",
        hashedPassword:
          "$2b$10$O75hC1vb0YpAPy2oDIWJzupjhXhav3f9rZTMv75QKk3rvQ7CQmvpy",
      };
    });
    const generateTokens = jest.fn(() => {
      {
        return {
          accessToken: "accessToken",
          accessTokenIssueTime: "Mon, 15 May 2023 17:28:20 GMT",
          accessTokenExpirationTime: "Sun, 04 Jun 2023 17:28:20 GMT",
          refreshToken: "refreshToken",
          refreshTokenIssueTime: "Mon, 15 May 2023 17:28:20 GMT",
          refreshTokenExpirationTime: "Tue, 14 May 2024 17:28:20 GMT",
        };
      }
    });
    const httpRequest = {
      body: {
        email: "johndoe@example.com",
        password: "password",
      },
    };
    const expectedResponse = {
      headers: { "Content-Type": "application/json" },
      statusCode: 201,
      body: {
        success: true,
        user: {
          id: "cjld2cjxh0006qzrmn831i7rn",
          firstName: "John",
          lastName: "Doe",
          email: "johndoe@example.com",
          createdOn: "Tue, 16 May 2023 12:12:13 GMT",
          modifiedOn: "Tue, 16 May 2023 12:12:13 GMT",
        },
        tokens: {
          access: {
            token: "accessToken",
            issuedAt: "Mon, 15 May 2023 17:28:20 GMT",
            expiresIn: "Sun, 04 Jun 2023 17:28:20 GMT",
          },
          refresh: {
            token: "refreshToken",
            issuedAt: "Mon, 15 May 2023 17:28:20 GMT",
            expiresIn: "Tue, 14 May 2024 17:28:20 GMT",
          },
        },
      },
    };

    const loginUser = makeLoginUser({
      authenticateUser,
      generateTokens,
      prepareResponseBody,
      handleError,
    });
    const response = await loginUser(httpRequest);
    expect(response).toMatchObject(expectedResponse);
  });
  it("return user not found respones when try to login", async () => {
    const authenticateUser = jest.fn(() => {
      throw new Error(
        "User not found. Please check the provided details and try again."
      );
    });
    const httpRequest = {
      body: {
        email: "johndoe@example.com",
        password: "password",
      },
    };
    const expectedResponse = {
      body: {
        error:
          "User not found. Please check the provided details and try again.",
        success: false,
      },
      headers: { "Content-Type": "application/json" },
      statusCode: 400,
    };
    const generateTokens = jest.fn(() => null);
    const loginUser = makeLoginUser({
      authenticateUser,
      generateTokens,
      prepareResponseBody,
      handleError,
    });
    const actualResponse = await loginUser(httpRequest);
    expect(actualResponse).toMatchObject(expectedResponse);
  });
});
