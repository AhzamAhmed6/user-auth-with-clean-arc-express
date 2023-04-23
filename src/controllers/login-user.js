import logger from "../logger/index.js";

const requiredEnvVars = [
  "ACCESS_KEY",
  "ACCESS_EXP_TIME",
  "REFRESH_KEY",
  "REFRESH_EXP_TIME",
];

export default function makeLoginUser({
  authenticateUser,
  generateToken,
  getExpirationTime,
}) {
  return async function loginUser(httpRequest) {
    try {
      const envVars = {};
      for (const envVar of requiredEnvVars) {
        if (!process.env[envVar]) {
          const error = new Error(`${envVar} environment variable not set`);
          logger.error(`${error.message}\n${error.stack}`);

          throw new Error(`An unknown error occurred.`);
        }
        envVars[envVar] = process.env[envVar];
      }

      const credentials = httpRequest.body;
      const userInfo = await authenticateUser(credentials);

      // Generate access token and calculate its expiration time
      const accessPayload = { userId: userInfo.id, email: userInfo.email };

      const accessToken = await generateToken({
        payload: accessPayload,
        tokenKey: envVars.ACCESS_KEY,
        tokenExpTime: envVars.ACCESS_EXP_TIME,
      });
      const accessTokenIssueTime = new Date(Date.now()).toUTCString();
      const accessTokenExpirationTime = await getExpirationTime({
        tokenExpTime: envVars.ACCESS_EXP_TIME,
      });

      // Generate refresh token and calculate its expiration time
      const refreshPayload = { userId: userInfo.id };

      const refreshToken = await generateToken({
        payload: refreshPayload,
        tokenKey: envVars.REFRESH_KEY,
        tokenExpTime: envVars.REFRESH_EXP_TIME,
      });
      const refreshTokenIssueTime = new Date(Date.now()).toUTCString();
      const refreshTokenExpirationTime = await getExpirationTime({
        tokenExpTime: envVars.REFRESH_EXP_TIME,
      });

      const { hashedPassword, ...userWithoutSensitiveData } = userInfo;
      const responseBody = {
        success: true,
        user: userWithoutSensitiveData,
        tokens: {
          access: {
            token: accessToken,
            issuedAt: accessTokenIssueTime,
            expiresIn: accessTokenExpirationTime,
          },
          refresh: {
            token: refreshToken,
            issuedAt: refreshTokenIssueTime,
            expiresIn: refreshTokenExpirationTime,
          },
        },
      };

      // Return success response
      const headers = { "Content-Type": "application/json" };
      const statusCode = 201;
      const body = responseBody;
      return { headers, statusCode, body };
    } catch (error) {
      const errorHeaders = { "Content-Type": "application/json" };
      if (error instanceof Error) {
        // Return error response
        const errorStatusCode = 400;
        const errorBody = {
          success: false,
          error: error.message,
        };
        return {
          headers: errorHeaders,
          statusCode: errorStatusCode,
          body: errorBody,
        };
      } else {
        logger.error(
          `The loginUser function failed due to an error.\n\t\t${error.stack}`
        );
        const unknownErrorStatusCode = 400;
        const unknownErrorBody = {
          success: false,
          error:
            "An error occurred while processing your request. Please try again later.",
        };
        return {
          headers: errorHeaders,
          statusCode: unknownErrorStatusCode,
          body: unknownErrorBody,
        };
      }
    }
  };
}
