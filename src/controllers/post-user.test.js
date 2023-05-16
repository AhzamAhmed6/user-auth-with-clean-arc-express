import makePostUser from "./post-user";
import postUserDependencies from "../controller-helper/post-user.helper";

const { addUserToDatabase, prepareResponseBody, handleError } =
  postUserDependencies;

describe("postUser", () => {
  it("post a user into Database", async () => {
    const fixedDate = new Date(Date.UTC(2022, 0, 1, 12, 0, 0));
    const fixedUTCString = fixedDate.toUTCString();
    const addUserToDatabase = jest.fn((userInfo) => {
      delete userInfo.password;
      userInfo.createdOn = fixedUTCString;
      userInfo.modifiedOn = fixedUTCString;
      return userInfo;
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
    const postUser = makePostUser({
      generateTokens,
      addUserToDatabase,
      prepareResponseBody,
      handleError,
    });
    const httpRequest = {
      body: {
        id: "123",
        name: "John Doe",
        email: "johndoe@example.com",
        password: "password",
      },
    };
    const response = await postUser(httpRequest);
    const expectedResponse = {
      headers: { "Content-Type": "application/json" },
      statusCode: 201,
      body: {
        success: true,
        user: {
          id: "123",
          name: "John Doe",
          email: "johndoe@example.com",
          createdOn: "Sat, 01 Jan 2022 12:00:00 GMT",
          modifiedOn: "Sat, 01 Jan 2022 12:00:00 GMT",
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
    expect(response).toMatchObject(expectedResponse);
  });

  it("post a user with incomplete Information", async () => {
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
    const postUser = makePostUser({
      generateTokens,
      addUserToDatabase,
      prepareResponseBody,
      handleError,
    });
    const httpRequest = {
      body: {
        id: "cjld2cjxh0006qzrmn831i7rn",
        firstName: "John",
        lastName: "Doe",
        email: "johndoe@example.com",
      },
    };
    const response = await postUser(httpRequest);
    const expectedResponse = {
      headers: { "Content-Type": "application/json" },
      statusCode: 400,
      body: {
        success: false,
        error:
          "All fields are required. Please provide complete information for the user",
      },
    };
    expect(response).toMatchObject(expectedResponse);
  });
  it("post a already present user", async () => {
    const addUserToDatabase = jest.fn(() => { throw Error("Unable to register user. The provided email address is already associated with an existing account.") })
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
    const postUser = makePostUser({ generateTokens,
      addUserToDatabase,
      prepareResponseBody,
      handleError,
    })
    const httpRequest = {
      body: {
        id: "123",
        name: "John Doe",
        email: "johndoe@example.com",
        password: "password",
      },
    };
    const expectedResponse = {
      headers: { "Content-Type": "application/json" },
      statusCode: 400,
      body: {
        "success": false,
        "error": "Unable to register user. The provided email address is already associated with an existing account."
      }
    };
    const response = await postUser(httpRequest);
    expect(response).toMatchObject(expectedResponse);

  })
});
