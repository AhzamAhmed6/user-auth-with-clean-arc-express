export default function makeAuthUser({ verifyToken, findUser }) {
  return async function authUser(httpRequest, httpResponse, nextFunction) {
    const token = httpRequest.headers.authorization;

    if (token === undefined || !token.startsWith("Bearer")) {
      return httpResponse.status(401).json({
        success: false,
        error: "Authorization header is missing or invalid.",
      });
    }

    const user = await verifyToken({
      token: token.split(" ")[1],
      tokenKey: process.env.ACCESS_KEY,
    });

    if (user === false) {
      httpResponse.user = false;
      nextFunction();
    }

    try {
      httpRequest.user = await findUser({ id: user.userId });
    } catch (error) {
      httpRequest.user = false;
    }

    nextFunction();
  };
}
