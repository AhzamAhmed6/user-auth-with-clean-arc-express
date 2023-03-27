export default function makePostUser({ addUser, makeTokens }) {
  return async function postUser(httpRequest) {
    try {
      const userInfo = httpRequest.body;

      const accessPayload = { userId: userInfo.id, email: userInfo.email };
      const accessTokenKey = process.env.ACCESS_KEY;
      const accessTokenExpTime = process.env.ACCESS_EXP_TIME;
      const accessToken = await makeTokens.generateToken({
        payload: accessPayload,
        jwtKey: accessTokenKey,
        tokenExpTime: accessTokenExpTime,
      });

      const refreshPayload = { userId: userInfo.id };
      const refreshTokenKey = process.env.REFRESH_KEY;
      const refreshTokenExpTime = process.env.REFRESH_EXP_TIME;
      const refreshToken = await makeTokens.generateToken({
        payload: refreshPayload,
        jwtKey: refreshTokenKey,
        tokenExpTime: refreshTokenExpTime,
      });

      const posted = await addUser(userInfo);
      delete posted.hashedPassword;
      return {
        headers: {
          "Content-Type": "application/json",
          "Last-Modified": new Date(posted.modifiedOn).toUTCString(),
        },
        statusCode: 201,
        body: { posted, accessToken, refreshToken },
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
          error: e.message,
        },
      };
    }
  };
}
