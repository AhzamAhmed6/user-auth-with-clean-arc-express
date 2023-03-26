export default function buildMakeTokens({ jwt, jwtKey, expTime }) {
  return Object.freeze({
    generateAccessToken,
    verifyAccessToken,
  });
  async function generateAccessToken({ id }) {
    return await jwt.sign({ userId: id }, jwtKey, { expiresIn: expTime });
  }
  async function verifyAccessToken({ accessToken }) {
    return await jwt.verify(accessToken, jwtKey);
  }
}
