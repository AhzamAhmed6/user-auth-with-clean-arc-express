export default function makeIssueToken({
  generateTokens,
  buildResponse,
  handleError,
}) {
  return async function issueToken(httpRequest) {
    const { user } = httpRequest;
    try {
      if (user == false) {
        throw Error("User Not Found");
      }
      const tokens = await generateTokens(user);
      return buildResponse(tokens);
    } catch (error) {
      return handleError(error);
    }
  };
}
