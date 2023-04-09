export default function makePostUser({
  addUser,
  generateToken,
  getExpirationTime,
}) {
  return async function postUser(httpRequest) {
    try {
      const userInfo = httpRequest.body;

      // Generate access token and calculate its expiration time
      const accessPayload = { userId: userInfo.id, email: userInfo.email };
      const accessTokenKey = process.env.ACCESS_KEY;
      const accessTokenExpTime = process.env.ACCESS_EXP_TIME;
      const accessToken = await generateToken({
        payload: accessPayload,
        tokenKey: accessTokenKey,
        tokenExpTime: accessTokenExpTime,
      });
      const accessTokenIssueTime = new Date(Date.now()).toUTCString()
      const accessTokenExpirationTime = await getExpirationTime({
        tokenExpTime: accessTokenExpTime,
      });

      // Generate refresh token and calculate its expiration time
      const refreshPayload = { userId: userInfo.id };
      const refreshTokenKey = process.env.REFRESH_KEY;
      const refreshTokenExpTime = process.env.REFRESH_EXP_TIME;
      const refreshToken = await generateToken({
        payload: refreshPayload,
        tokenKey: refreshTokenKey,
        tokenExpTime: refreshTokenExpTime,
      });
      const refreshTokenIssueTime = new Date(Date.now()).toUTCString()
      const refreshTokenExpirationTime = await getExpirationTime({
        tokenExpTime: refreshTokenExpTime,
      });

      // Add user to the database and prepare response body
      const user = await addUser(userInfo);
      const { hashedPassword, ...userWithoutSensitiveData } = user;
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
      return {
        headers: {
          "Content-Type": "application/json",
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
