export default function makeAuthenticateUser({ usersDb, verifyPassword }) {
  return async function authenticateUser({ email, password }) {
    const existingUserByEmail = await usersDb.findByEmail({
      email: email,
    });
    if (!existingUserByEmail) {
      throw new Error("User Not Found");
    }
    const isPasswordMatch = await verifyPassword({
      password: password,
      hashedPassword: existingUserByEmail.hashedPassword,
    });
    if (!isPasswordMatch) {
      throw new Error("Wrong Password");
    }
    return existingUserByEmail;
  };
}
