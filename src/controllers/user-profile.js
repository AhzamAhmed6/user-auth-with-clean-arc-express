export default function makeUserProfile({authorizeUser, handleError}) {
  return async function userProfile(httpRequest) {
    try {
      const user = authorizeUser(httpRequest);
      delete user.hashedPassword

      const headers = { "Content-Type": "application/json" };
      const statusCode = 200;
      const body = user;
      return { headers, statusCode, body };
    } catch (error) {
      return handleError(error);
    }
  }
}