export default function makePostUser({ addUser, makeTokens }) {
  return async function postUser(httpRequest) {
    try {
      const userInfo = httpRequest.body;

      // Generate access token and calculate its expiration time
      const accessPayload = { userId: userInfo.id, email: userInfo.email };
      const accessTokenKey = process.env.ACCESS_KEY;
      const accessTokenExpTime = process.env.ACCESS_EXP_TIME;
      const accessToken = await makeTokens.generateToken({
        payload: accessPayload,
        tokenKey: accessTokenKey,
        tokenExpTime: accessTokenExpTime,
      });
      const accessTokenExpTimeInSeconds = await makeTokens.getExpirationTime({
        tokenExpTime: accessTokenExpTime,
      });

      // Generate refresh token and calculate its expiration time
      const refreshPayload = { userId: userInfo.id };
      const refreshTokenKey = process.env.REFRESH_KEY;
      const refreshTokenExpTime = process.env.REFRESH_EXP_TIME;
      const refreshToken = await makeTokens.generateToken({
        payload: refreshPayload,
        tokenKey: refreshTokenKey,
        tokenExpTime: refreshTokenExpTime,
      });
      const refreshTokenExpTimeInSeconds = await makeTokens.getExpirationTime({
        tokenExpTime: refreshTokenExpTime,
      });

      // Add user to the database and prepare response body
      const user = await addUser(userInfo);
      const { modifiedOn, hashedPassword, ...userWithoutSensitiveData } = user;
      const responseBody = {
        success: true,
        user: userWithoutSensitiveData,
        tokens: {
          access: {
            token: accessToken,
            expiresIn: accessTokenExpTimeInSeconds,
          },
          refresh: {
            token: refreshToken,
            expiresIn: refreshTokenExpTimeInSeconds,
          },
        },
      };

      // Return success response
      return {
        headers: {
          "Content-Type": "application/json",
          "Last-Modified": new Date(modifiedOn).toUTCString(),
        },
        statusCode: 201,
        body: responseBody,
      };
    } catch (error) {
      console.error(`Error: ${error}`);
      // Return error response
      return {
        headers: {
          "Content-Type": "application/json",
        },
        statusCode: 400,
        body: {
          success: false,
          error: error.message,
        },
      };
    }
  };
}
