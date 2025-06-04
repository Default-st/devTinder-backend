import validator from "validator";

export const validateSignUpData = (data) => {
  const { firstName, lastName, emailId, password } = data;

  if (!firstName || !lastName) {
    throw new Error("Name is not valid!");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid!");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong Password!");
  }
};

export const validateLoginData = (data) => {
  const { emailId, password } = data;
  if (!validator.isEmail(emailId) || !validator.isStrongPassword(password)) {
    throw new console.error("Email ID or Password is not valid");
  }
};

export const validateProfileEditData = (data) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "age",
    "photoUrl",
    "gender",
    "about",
    "skills",
  ];

  const isEditAllowed = Object.keys(data).every((field) =>
    allowedEditFields.includes(field)
  );
  return isEditAllowed;
};
