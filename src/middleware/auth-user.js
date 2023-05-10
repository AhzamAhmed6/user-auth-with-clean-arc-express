export default function makeAuthUser({ verifyToken }) {
  return async function authUser(httpRequest, httpResponse, nextFunction) {
    const token = httpRequest.headers.authorization;

    if (token === undefined || !token.startsWith("Bearer")) {
      return httpResponse
        .status(401)
        .json({ error: "Authorization header is missing or invalid." });
    }

    httpRequest.user = await verifyToken({
      token: token.split(" ")[1],
      tokenKey: process.env.ACCESS_KEY,
    });

    nextFunction();
  };
}
