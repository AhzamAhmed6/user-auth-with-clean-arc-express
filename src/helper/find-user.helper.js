import usersDb from "../data-access/index.js";

function validateInput({ id, email }) {
  if (!id && !email) {
    throw new Error("Provide id or email");
  }
}

function makeFindUserById({ usersDb }) {
  return async function findUserById({ id }) {
    const exists = await usersDb.findById({ id: id });
    if (!exists) {
      throw new Error("User not found.");
    }
    return exists;
  };
}

function makeFindUserByEmail({ usersDb }) {
  return async function findUserByEmail({ email }) {
    const exists = await usersDb.findByEmail({ email: email });
    if (!exists) {
      throw new Error("User not found.");
    }
    return exists;
  };
}

const findById = makeFindUserById({ usersDb });
const findByEmail = makeFindUserByEmail({ usersDb });

const findUserDependencies = { validateInput, findById, findByEmail };
export default findUserDependencies;
