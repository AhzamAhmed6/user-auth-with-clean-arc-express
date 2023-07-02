import usersDb from "../data-access/index.js";


function validateInputs(id, firstName, lastName) {
  if (!id) {
    throw new Error("You must supply an id.");
  }
  if (!firstName || !lastName) {
    throw new Error("You must supply first name and last name.");
  }
}

function makeFindExistingUser({ usersDb }) {
  return async function findExistingUser({ id }) {
    const existing = await usersDb.findById({ id });
    if (!existing) {
      throw new RangeError("User not found.");
    }
    return existing;
  }
}

const findExistingUser = makeFindExistingUser({usersDb})

function getPassword(rest) {
  password = rest.hashedPassword;
  delete rest.hashedPassword;
  return password;
}

function makeUpdateUserName({ usersDb }) {
  return async function updateUserName(existing, user) {
    const updated = await usersDb.updateName({
      id: existing.id,
      firstName: user.getFirstName(),
      lastName: user.getLastName(),
      email: existing.email,
      hashedPassword: existing.hashedPassword,
    });
    return updated;
  }

}

const updateUserName = makeUpdateUserName({ usersDb })


const editUserNameDependencies = {
  validateInputs,findExistingUser,getPassword,updateUserName
}

export default editUserNameDependencies