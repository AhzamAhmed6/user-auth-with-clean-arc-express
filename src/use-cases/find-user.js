export default function makeFindUser({ usersDb }) {
  return async function findUser({ id, email }) {
    validateInput({ id, email });

    if (id) {
      return findUserById({ id, usersDb });
    }
    if (email) {
      return findUserByEmail({ email, usersDb });
    }
  };
}

function validateInput({ id, email }) {
  if (!id && !email) {
    throw new Error("Provide id or email");
  }
}

async function findUserById({ id, usersDb }) {
  const exists = await usersDb.findById({ id: id });
  if (!exists) {
    throw new Error("User not found.");
  }
  return exists;
}

async function findUserByEmail({ email, usersDb }) {
  const exists = await usersDb.findByEmail({ email: email });
  if (!exists) {
    throw new Error("User not found.");
  }
  return exists;
}
