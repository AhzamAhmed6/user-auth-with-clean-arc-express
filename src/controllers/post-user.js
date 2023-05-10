import logger from "../logger/index.js";

const requiredEnvVars = [
  "ACCESS_KEY",
  "ACCESS_EXP_TIME",
  "REFRESH_KEY",
  "REFRESH_EXP_TIME",
];

export default function makePostUser({
  addUser,
  generateToken,
  getExpirationTime,
}) {
  return async function postUser(httpRequest) {
    try {
      const envVars = checkRequiredEnvVars();

      const userInfo = httpRequest.body;
      const tokens = await generateTokens(
        userInfo,
        envVars,
        generateToken,
        getExpirationTime
      );

      const userWithoutSensitiveData = await addUserToDatabase(
        userInfo,
        addUser
      );

      const responseBody = prepareResponseBody(
        userWithoutSensitiveData,
        tokens
      );

      const headers = { "Content-Type": "application/json" };
      const statusCode = 201;
      const body = responseBody;
      return { headers, statusCode, body };
    } catch (error) {
      if (error instanceof Error) {
        return handleError(error, handleClientError);
      }
      return handleError(error, handleServerError);
    }
  };

  function checkRequiredEnvVars() {
    const envVars = {};
    for (const envVar of requiredEnvVars) {
      if (!process.env[envVar]) {
        const error = new Error(`${envVar} environment variable not set`);
        logger.error(`${error.message}\n${error.stack}`);
        throw new Error(`An unknown error occurred.`);
      }
      envVars[envVar] = process.env[envVar];
    }
    return envVars;
  }

  async function generateTokens(userInfo, envVars, generateToken) {
    const accessToken = await generateAccessToken(
      userInfo,
      envVars,
      generateToken
    );
    const refreshToken = await generateRefreshToken(
      userInfo,
      envVars,
      generateToken
    );
    return {
      ...accessToken,
      ...refreshToken,
    };
  }

  async function generateAccessToken(userInfo, envVars, generateToken) {
    const accessPayload = {
      userId: userInfo.id,
      email: userInfo.email,
    };
    const accessToken = await generateToken({
      payload: accessPayload,
      tokenKey: envVars.ACCESS_KEY,
      tokenExpTime: envVars.ACCESS_EXP_TIME,
    });
    const accessTokenIssueTime = new Date().toUTCString();
    const accessTokenExpirationTime = await calculateTokenExpirationTime(
      envVars.ACCESS_EXP_TIME
    );
    return {
      accessToken,
      accessTokenIssueTime,
      accessTokenExpirationTime,
    };
  }

  async function generateRefreshToken(userInfo, envVars, generateToken) {
    const refreshPayload = {
      userId: userInfo.id,
    };
    const refreshToken = await generateToken({
      payload: refreshPayload,
      tokenKey: envVars.REFRESH_KEY,
      tokenExpTime: envVars.REFRESH_EXP_TIME,
    });
    const refreshTokenIssueTime = new Date().toUTCString();
    const refreshTokenExpirationTime = await calculateTokenExpirationTime(
      envVars.REFRESH_EXP_TIME
    );
    return {
      refreshToken,
      refreshTokenIssueTime,
      refreshTokenExpirationTime,
    };
  }

  async function calculateTokenExpirationTime(tokenExpTime) {
    return await getExpirationTime({ tokenExpTime });
  }

  async function addUserToDatabase(userInfo, addUser) {
    const user = await addUser(userInfo);
    const { hashedPassword, ...userWithoutSensitiveData } = user;
    return userWithoutSensitiveData;
  }

  function prepareResponseBody(userWithoutSensitiveData, tokens) {
    const responseBody = {
      success: true,
      user: userWithoutSensitiveData,
      tokens: {
        access: {
          token: tokens.accessToken,
          issuedAt: tokens.accessTokenIssueTime,
          expiresIn: tokens.accessTokenExpirationTime,
        },
        refresh: {
          token: tokens.refreshToken,
          issuedAt: tokens.refreshTokenIssueTime,
          expiresIn: tokens.refreshTokenExpirationTime,
        },
      },
    };
    return responseBody;
  }

  function handleError(error, errorHandler) {
    return errorHandler(error);
  }

  function handleClientError(error) {
    const headers = { "Content-Type": "application/json" };
    const statusCode = 400;
    const message = error.message;
    const body = { success: false, error: message };
    return { headers, statusCode, body };
  }

  function handleServerError(error) {
    const headers = { "Content-Type": "application/json" };
    const statusCode = 500;
    const message =
      "An error occurred while processing your request. Please try again later.";
    const body = { success: false, error: message };
    logger.error(
      `An unknown error occurred while processing a request.\n\t\t${error.stack}`
    );
    return { headers, statusCode, body };
  }
}
