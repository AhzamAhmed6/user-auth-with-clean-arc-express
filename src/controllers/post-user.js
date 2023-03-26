export default function makePostUser({ addUser, makeTokens }) {
  return async function postUser(httpRequest) {
    try {
      const userInfo = httpRequest.body;
      const accessToken = await makeTokens.generateAccessToken({
        id: userInfo.id,
      });
      const posted = await addUser(userInfo);
      delete posted.hashedPassword;
      return {
        headers: {
          "Content-Type": "application/json",
          "Last-Modified": new Date(posted.modifiedOn).toUTCString(),
        },
        statusCode: 201,
        body: { posted, accessToken },
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
