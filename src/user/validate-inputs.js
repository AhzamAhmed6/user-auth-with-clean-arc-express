function makeValidateInputs({
  validateId,
  validateRequiredFields,
  validateEmail,
  validatePassword,
}) {
  return function validateInputs({ id, firstName, lastName, email, password }) {
    validateId({ id });
    validateRequiredFields({ firstName, lastName, email, password });
    validateEmail({ email });
    validatePassword({ password });
  };
}

function makeValidateId({ Id }) {
  return function validateId({ id }) {
    if (!Id.isValidId(id)) {
      throw new Error("The user ID provided is not valid");
    }
  };
}

function validateRequiredFields({ firstName, lastName, email, password }) {
  if (![firstName, lastName, email, password].every(Boolean)) {
    throw new Error(
      "All fields are required. Please provide complete information for the user"
    );
  }
}

function validateEmail({ email }) {
  const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[\w-]{2,}$/;
  if (!emailRegex.test(email.toLowerCase())) {
    throw new Error(`${email} is not a valid email`);
  }
}

function validatePassword({ password }) {
  const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  if (!passwordRegex.test(password)) {
    const errorMessage =
      "The password must be at least 8 characters long and include at least one symbol, uppercase letter, lowercase letter, and number.";
    throw new Error(errorMessage);
  }
}

import Id from "../Id/index.js";
const validateId = makeValidateId({ Id });
const validateInputs = makeValidateInputs({
  validateId,
  validateRequiredFields,
  validateEmail,
  validatePassword,
});

export default validateInputs;
