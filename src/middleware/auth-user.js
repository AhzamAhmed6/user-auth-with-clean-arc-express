export default function makeAuthUser({ verifyToken }) {
  return async function authUser(httpRequest, httpResponse, nextFunction) {
    const token = httpRequest.headers.authorization;

    if (token === undefined || !token.startsWith("Bearer")) {
      return httpResponse
        .status(401)
        .json({ error: "Authorization header is missing or invalid." });
    }

    const isValidToken = await verifyToken({
      token: token.split(" ")[1],
      tokenKey: process.env.ACCESS_KEY,
    });

    if (isValidToken === false) {
      httpRequest.valid = false;
      nextFunction();
    }
    httpRequest.valid = true;
    httpRequest.user = isValidToken;

    nextFunction();
  };
}
