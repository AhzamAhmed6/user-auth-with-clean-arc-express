export default function makeTokens({ jwt,jwtKey,expTime }) {
  return Object.freeze({
    generateToken, verifyToken
  })
  async function generateToken({ id}) {
    return jwt.sign({ userId: id }, jwtKey, { expiresIn: expTime })
  }
  async function verifyToken({ token}) {
    return jwt.verify(token, jwtKey)
  }
}