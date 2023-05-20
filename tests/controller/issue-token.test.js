import makeIssueToken from "../../src/controllers/issue-token";
import issueTokenDependencies from "../../src/controller-helper/issue-token.helper";

const { generateTokens, buildResponse, handleError } = issueTokenDependencies;

describe("IssueTokens", () => {
  it("should return user not found", async () => {
    const httpRequest = {};
    httpRequest.user = false;
    const issueToken = makeIssueToken(issueTokenDependencies);
    const actualResponse = await issueToken(httpRequest);
    const expectedResponse = {
      headers: { "Content-Type": "application/json" },
      statusCode: 400,
      body: { success: false, error: "User Not Found" },
    };
    expect(actualResponse).toMatchObject(expectedResponse);
  });

  it("shoud issue new tokens", async () => {
    const httpRequest = {};
    httpRequest.user = {
      id: 1234,
      email: "test@test.com",
    };
    const generateTokens = jest.fn(() => {
      return {
        accessToken: "accessToken",
        accessTokenIssueTime: "Sat, 20 May 2023 16:02:26 GMT",
        accessTokenExpirationTime: "Fri, 09 Jun 2023 16:02:26 GMT",
        refreshToken: "refreshToken",
        refreshTokenIssueTime: "Sat, 20 May 2023 16:02:26 GMT",
        refreshTokenExpirationTime: "Sun, 19 May 2024 16:02:26 GMT",
      };
    });
    const issueToken = makeIssueToken({
      generateTokens,
      buildResponse,
      handleError,
    });
    const actualResponse = await issueToken(httpRequest);
    const expectedResponse = {
      headers: { "Content-Type": "application/json" },
      statusCode: 200,
      body: {
        success: true,
        tokens: {
          access: {
            token: "accessToken",
            issuedAt: "Sat, 20 May 2023 16:02:26 GMT",
            expiresIn: "Fri, 09 Jun 2023 16:02:26 GMT",
          },
          refresh: {
            token: "refreshToken",
            issuedAt: "Sat, 20 May 2023 16:02:26 GMT",
            expiresIn: "Sun, 19 May 2024 16:02:26 GMT",
          },
        },
      },
    };
    expect(actualResponse).toMatchObject(expectedResponse);
  });
});
