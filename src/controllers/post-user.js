export default function makePostUser({ addUser, makeTokens }) {
  return async function postUser(httpRequest) {
    var success = false;
    try {
      const userInfo = httpRequest.body;

      const accessPayload = { userId: userInfo.id, email: userInfo.email };
      const accessTokenKey = process.env.ACCESS_KEY;
      const accessTokenExpTime = process.env.ACCESS_EXP_TIME;
      const accessToken = await makeTokens.generateToken({
        payload: accessPayload,
        tokenKey: accessTokenKey,
        tokenExpTime: accessTokenExpTime,
      });
      const accessTokenExpTimeInSeconds = makeTokens.getExpirationTime({
        tokenExpTime: accessTokenExpTime,
      });

      const refreshPayload = { userId: userInfo.id };
      const refreshTokenKey = process.env.REFRESH_KEY;
      const refreshTokenExpTime = process.env.REFRESH_EXP_TIME;
      const refreshToken = await makeTokens.generateToken({
        payload: refreshPayload,
        tokenKey: refreshTokenKey,
        tokenExpTime: refreshTokenExpTime,
      });
      const refreshTokenExpTimeInSeconds = makeTokens.getExpirationTime({
        tokenExpTime: refreshTokenExpTime,
      });

      const user = await addUser(userInfo);
      delete user.hashedPassword;
      success = true;
      return {
        headers: {
          "Content-Type": "application/json",
          "Last-Modified": new Date(user.modifiedOn).toUTCString(),
        },
        statusCode: 201,
        body: {
          success,
          user,
          tokens: {
            access: {
              token: accessToken,
              expiresIn: await accessTokenExpTimeInSeconds,
            },
            refresh: {
              token: refreshToken,
              expiresIn: await refreshTokenExpTimeInSeconds,
            },
          },
        },
      };
    } catch (e) {
      // TODO: Error logging
      console.log(e);

      return {
        headers: {
          "Content-Type": "application/json",
        },
        statusCode: 400,
        body: {
          success,
          error: e.message,
        },
      };
    }
  };
}
