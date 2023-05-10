import logger from "../logger/index.js";

export default function makeLoginUser({
  authenticateUser,
  generateToken,
  getExpirationTime,
  requiredEnvVars,
}) {
  return async function loginUser(httpRequest) {
    try {
      const envVars = checkRequiredEnvVars(requiredEnvVars);

      const credentials = httpRequest.body;
      const userInfo = await authenticateUser(credentials);

      const tokens = await generateTokens(
        userInfo,
        envVars,
        generateToken,
        getExpirationTime
      );

      const { hashedPassword, ...userWithoutSensitiveData } = userInfo;
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
}

function checkRequiredEnvVars(requiredEnvVars) {
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

async function generateTokens(
  userInfo,
  envVars,
  generateToken,
  getExpirationTime
) {
  const accessToken = await generateAccessToken(
    userInfo,
    envVars,
    generateToken,
    getExpirationTime
  );
  const refreshToken = await generateRefreshToken(
    userInfo,
    envVars,
    generateToken,
    getExpirationTime
  );
  return {
    ...accessToken,
    ...refreshToken,
  };
}

async function generateAccessToken(
  userInfo,
  envVars,
  generateToken,
  getExpirationTime
) {
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
  const accessTokenExpirationTime = await calculateTokenExpirationTime({
    tokenExpTime: envVars.ACCESS_EXP_TIME,
    getExpirationTime,
  });
  return {
    accessToken,
    accessTokenIssueTime,
    accessTokenExpirationTime,
  };
}

async function generateRefreshToken(
  userInfo,
  envVars,
  generateToken,
  getExpirationTime
) {
  const refreshPayload = {
    userId: userInfo.id,
  };
  const refreshToken = await generateToken({
    payload: refreshPayload,
    tokenKey: envVars.REFRESH_KEY,
    tokenExpTime: envVars.REFRESH_EXP_TIME,
  });
  const refreshTokenIssueTime = new Date().toUTCString();
  const refreshTokenExpirationTime = await calculateTokenExpirationTime({
    tokenExpTime: envVars.REFRESH_EXP_TIME,
    getExpirationTime,
  });
  return {
    refreshToken,
    refreshTokenIssueTime,
    refreshTokenExpirationTime,
  };
}

async function calculateTokenExpirationTime({
  tokenExpTime,
  getExpirationTime,
}) {
  return await getExpirationTime({ tokenExpTime });
}

function prepareResponseBody(userWithoutSensitiveData, tokens) {
  return {
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
}

function handleError(error, errorHandler) {
  return errorHandler(error);
}

function handleClientError(error) {
  const headers = { "Content-Type": "application/json" };
  const statusCode = 400;
  const { message } = error;
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
