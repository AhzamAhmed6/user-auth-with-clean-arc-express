import buildMakeHashPassword from "./hash-password";
import buildMakeVerifyPassword from "./verify-password";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

const bcryptSalt = process.env.BCRYPT_SALT;
const makeHashPassword = buildMakeHashPassword({ bcrypt, bcryptSalt });
const makeVerifyPassword = buildMakeVerifyPassword({ bcrypt });

const handlePassword = Object.freeze({
  hashPassword: ({ password }) => makeHashPassword({ password }),
  verifyPassword: ({ password, hashedPassword }) =>
    makeVerifyPassword({ password, hashedPassword }),
});

export default handlePassword;
