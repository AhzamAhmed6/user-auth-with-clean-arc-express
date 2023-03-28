export default function buildMakeVerifyPassword({ bcrypt }) {
  return async function verifyPassword({ password, hashedPassword }) {
    try {
      const isMatch = await bcrypt.compareSync(password, hashedPassword);
      return isMatch;
    } catch (e) {
      console.log("🚀 ~ file: verify-password.js:7 ~ verifyPassword ~ e:", e);
      return false;
    }
  };
}
