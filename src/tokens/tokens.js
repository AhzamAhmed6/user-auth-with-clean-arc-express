export default function buildMakeTokens({ jwt }) {
  return Object.freeze({
    generateToken,
    verifyToken,
    getExpirationTime,
  });
  async function generateToken({ payload, tokenKey, tokenExpTime }) {
    return await jwt.sign(payload, tokenKey, { expiresIn: tokenExpTime });
  }
  async function verifyToken({ token, tokenKey }) {
    return await jwt.verify(token, tokenKey);
  }
  async function getExpirationTime({ tokenExpTime }) {
    const regex = /(\d+y)?(\d+d)?(\d+h)?(\d+m)?(\d+s)?/;
    const [, y = 0, d = 0, h = 0, m = 0, s = 0] = await tokenExpTime.match(
      regex
    );
    const future = new Date(
      Date.now() +
        (parseInt(y) * 31536000 +
          parseInt(d) * 86400 +
          parseInt(h) * 3600 +
          parseInt(m) * 60 +
          parseInt(s)) *
          1000
    );
    const diff = Math.floor((future - Date.now()) / 1000);
    return diff;
  }
}
