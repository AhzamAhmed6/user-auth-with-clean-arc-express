export default function buildMakeTokens({ jwt }) {
  const TOKEN_REGEX = /(\d+y)?(\d+d)?(\d+h)?(\d+m)?(\d+s)?/;

  function generateToken({ payload, tokenKey, tokenExpTime }) {
    return jwt.sign(payload, tokenKey, { expiresIn: tokenExpTime });
  }

  function verifyToken({ token, tokenKey }) {
    try {
      return jwt.verify(token, tokenKey);
    } catch (error) {
      console.log("🚀 ~ file: tokens.js:12 ~ verifyToken ~ error:", error);
      return false;
    }
  }

  async function getExpirationTime({ tokenExpTime }) {
    const [, years = 0, days = 0, hours = 0, minutes = 0, seconds = 0] =
      tokenExpTime.match(TOKEN_REGEX);

    const futureDate = new Date(
      Date.now() +
        (parseInt(years) * 31536000 +
          parseInt(days) * 86400 +
          parseInt(hours) * 3600 +
          parseInt(minutes) * 60 +
          parseInt(seconds)) *
          1000
    ).toUTCString();

    return futureDate;
  }

  return Object.freeze({
    generateToken,
    verifyToken,
    getExpirationTime,
  });
}
