import usersDb from "../data-access/index.js";
import logger from "../logger/index.js";
import handlePassword from "../password/index.js";
import makeUser from "../user/index.js";

const { verifyPassword } = handlePassword;

function validateInputs({ id, oldPassword, newPassword }) {
  if (!id) {
    throw new Error("You must supply an id.");
  }
  if (!oldPassword || !newPassword) {
    throw new Error("You must supply old and new password.");
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

function makeValidateOldPassword({ verifyPassword }) {
  return async function validateOldPassword({ oldPassword, hashedPassword }) {
    const isPasswordMatched = await verifyPassword({
      password: oldPassword,
      hashedPassword: hashedPassword,
    });

    if (!isPasswordMatched) {
      throw new Error("Wrong Old Password.");
    }
  };
}

function makeUpdateUserPassword({ usersDb, makeUser }) {
  return async function updateUserPassword(rest, newPassword) {
    const user = makeUser({ password: newPassword, ...rest });

    const updated = await usersDb.updatePassword({
      id: user.getId(),
      firstName: user.getFirstName(),
      lastName: user.getLastName(),
      email: user.getEmail(),
      hashedPassword: await user.getHashedPassword(),
    });

    return updated;
  };
}

function makeHandleError({ handleClientError, handleServerError }) {
  return function handleError(error) {
    if (error instanceof Error) {
      return handleClientError(error);
    }
    return handleServerError(error);
  };
}

function handleClientError(error) {
  throw error;
}

function makeHandleServerError({ logger }) {
  return function handleServerError(error) {
    logger.error(
      `The authenticateUser function failed due to an error.\n\t\t${error.stack}`
    );
    throw new Error(
      "An error occurred while processing your request. Please try again later."
    );
  };
}

const findUserById = makeFindUserById({ usersDb });
const validateOldPassword = makeValidateOldPassword({ verifyPassword });
const updateUserPassword = makeUpdateUserPassword({ usersDb, makeUser });
const handleServerError = makeHandleServerError({ logger });
const handleError = makeHandleError({ handleClientError, handleServerError });

const editUserPasswordDependencies = {
  validateInputs,
  findUserById,
  validateOldPassword,
  updateUserPassword,
  handleError,
};

export default editUserPasswordDependencies;
