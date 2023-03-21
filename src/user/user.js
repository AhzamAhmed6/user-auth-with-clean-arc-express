export default function buildMakeUser({ Id, hashPassword }) {
  return function makeUser({
    id = Id.makeId(),
    firstName,
    lastName,
    email,
    password,
  }) {
    if (!Id.isValidId(id)) {
      throw new Error("User must have a valid id.");
    }
    if (
      id == undefined ||
      firstName == undefined ||
      lastName == undefined ||
      email == undefined ||
      password == undefined
    ) {
      throw new Error("Please provide complete information");
    }
    if (firstName.length < 1) {
      throw new Error("First Name must not be empty");
    }
    if (lastName.length < 1) {
      throw new Error("Last Name must not be empty");
    }
    if (!validateEmail(email)) {
      throw new Error(`${email} is not a valid email`);
    }
    if (!checkPassword(password)) {
      throw new Error(
        "Password must contains min 8 letter password, with at least a symbol, upper and lower case letters and a number"
      );
    }

    // whats the point of arrow function  here: we can use user.firstName() to access first name if user=user()
    return Object.freeze({
      getId: () => id,
      getFirstName: () => firstName,
      getLastName: () => lastName,
      getEmail: () => email,
      getHashedPassword: () => hashPassword(password),
    });

    /**
     * @ref https://www.simplilearn.com/tutorials/javascript-tutorial/email-validation-in-javascript
     */
    function validateEmail(input) {
      var validRegex =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

      if (input.match(validRegex)) {
        return true;
      } else {
        return false;
      }
    }

    /**
     * @ref https://stackoverflow.com/a/40923568/16325661
     */
    function checkPassword(str) {
      var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
      return re.test(str);
    }
  };
}

// when we do
// var = function1
// and function1 is returning function2, then, var stores the function2
// and when we pass variables to var, it become variables of function2
