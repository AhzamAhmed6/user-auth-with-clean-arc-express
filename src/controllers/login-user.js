export default function makeLoginUser({ findUser, makeTokens }) {
  return async function loginUser(httpRequest) {
    try {
      const userInfo = httpRequest.body;
      const user = await findUser(userInfo);
    } catch (e) {}
  };
}
