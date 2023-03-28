export default function buildMakeHashPassword({ bcrypt, bcryptSalt }) {
  return async function makeHashPassword({ password }) {
    try {
      const salt = await bcrypt.genSaltSync(parseInt(bcryptSalt));
      const hashedPassword = bcrypt.hashSync(password, salt);
      return hashedPassword;
    } catch (e) {
      return password;
    }
  };
}
