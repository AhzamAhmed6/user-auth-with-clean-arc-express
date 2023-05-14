import logger from "../logger/index.js";
import makeTokens from "../tokens/index.js";
import userService from "../use-cases/index.js";

const { addUser } = userService;
const { getExpirationTime, generateToken } = makeTokens;

const requiredEnvVars = [
  "ACCESS_KEY",
  "ACCESS_EXP_TIME",
  "REFRESH_KEY",
  "REFRESH_EXP_TIME",
];

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

function makeGenerateTokens({ generateAccessToken, generateRefreshToken }) {
  return async function generateTokens(userInfo) {
    const accessToken = await generateAccessToken(userInfo);
    const refreshToken = await generateRefreshToken(userInfo);
    return { ...accessToken, ...refreshToken };
  };
}

function makeGenerateAccessToken({
  envVars,
  generateToken,
  calculateTokenExpirationTime,
}) {
  return async function generateAccessToken(userInfo) {
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
    });
    return {
      accessToken,
      accessTokenIssueTime,
      accessTokenExpirationTime,
    };
  };
}

function makeGenerateRefreshToken({
  envVars,
  generateToken,
  calculateTokenExpirationTime,
}) {
  return async function generateRefreshToken(userInfo) {
    const refreshPayload = { userId: userInfo.id };
    const refreshToken = await generateToken({
      payload: refreshPayload,
      tokenKey: envVars.REFRESH_KEY,
      tokenExpTime: envVars.REFRESH_EXP_TIME,
    });
    const refreshTokenIssueTime = new Date().toUTCString();
    const refreshTokenExpirationTime = await calculateTokenExpirationTime({
      tokenExpTime: envVars.REFRESH_EXP_TIME,
    });
    return {
      refreshToken,
      refreshTokenIssueTime,
      refreshTokenExpirationTime,
    };
  };
}

function makeCalculateTokenExpirationTime({ getExpirationTime }) {
  return async function calculateTokenExpirationTime({ tokenExpTime }) {
    return await getExpirationTime({ tokenExpTime });
  };
}

function makeAddUserToDataBase({ addUser }) {
  return async function addUserToDatabase(userInfo) {
    const user = await addUser(userInfo);
    const { hashedPassword, ...userWithoutSensitiveData } = user;
    return userWithoutSensitiveData;
  };
}

function prepareResponseBody({ userWithoutSensitiveData, tokens }) {
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

function makeHandleError({ handleClientError, handleServerError }) {
  return function handleError(error) {
    if (error instanceof Error) {
      return handleClientError(error);
    }
    return handleServerError(error);
  };
}

function handleClientError(error) {
  const headers = { "Content-Type": "application/json" };
  const statusCode = 400;
  const { message } = error;
  const body = { success: false, error: message };
  return { headers, statusCode, body };
}

function makeHandleServerError({ logger }) {
  return function handleServerError(error) {
    const headers = { "Content-Type": "application/json" };
    const statusCode = 500;
    const message =
      "An error occurred while processing your request. Please try again later.";
    const body = { success: false, error: message };
    logger.error(
      `An unknown error occurred while processing a request.\n\t\t${error.stack}`
    );
    return { headers, statusCode, body };
  };
}

const envVars = checkRequiredEnvVars(requiredEnvVars);
const calculateTokenExpirationTime = makeCalculateTokenExpirationTime({
  getExpirationTime,
});
const generateAccessToken = makeGenerateAccessToken({
  envVars,
  generateToken,
  calculateTokenExpirationTime,
});
const generateRefreshToken = makeGenerateRefreshToken({
  envVars,
  generateToken,
  calculateTokenExpirationTime,
});
const generateTokens = makeGenerateTokens({
  generateAccessToken,
  generateRefreshToken,
});
const addUserToDatabase = makeAddUserToDataBase({ addUser });
const handleServerError = makeHandleServerError({ logger });
const handleError = makeHandleError({ handleClientError, handleServerError });

const postUserDependencies = {
  generateTokens,
  addUserToDatabase,
  prepareResponseBody,
  handleError,
};

export default postUserDependencies;
