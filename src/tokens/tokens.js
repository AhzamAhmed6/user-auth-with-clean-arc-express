export default function buildMakeTokens({ jwt }) {
  return Object.freeze({
    generateToken,
    verifyToken,
  });
  async function generateToken({ payload, jwtKey, tokenExpTime }) {
    return await jwt.sign(payload, jwtKey, { expiresIn: tokenExpTime });
  }
  async function verifyToken({ token, jwtKey }) {
    return await jwt.verify(token, jwtKey);
  }
}
