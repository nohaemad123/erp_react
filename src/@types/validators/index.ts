import { check, nonEmpty, nullish, number, optional, pipe, string, union } from "valibot";

export const requiredMsg = "This field is required";
export const invalidMsg = "Invalid input";
export const emailRegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+.[a-zA-Z]{2,}$/;

export const numberValidator = union(
  [
    number(requiredMsg),
    pipe(
      string(requiredMsg),
      nonEmpty(requiredMsg),
      check((x) => !isNaN(Number(x)), invalidMsg),
    ),
  ],
  requiredMsg,
);
const num = union(
  [
    number(invalidMsg),
    pipe(
      string(invalidMsg),
      check((x) => !x || !isNaN(Number(x)), "must be only number"),
    ),
  ],
  invalidMsg,
);
export const optionalNumberValidator = optional(num);
export const nullishNumberValidator = nullish(num);

export const phoneValidator = union(
  [
    number(requiredMsg),
    pipe(
      string(requiredMsg),
      nonEmpty(requiredMsg),
      check((x) => !isNaN(Number(x.replaceAll(" ", ""))), invalidMsg),
    ),
  ],
  requiredMsg,
);
const phone = union(
  [
    number(invalidMsg),
    pipe(
      string(invalidMsg),
      check((x) => !x || !isNaN(Number(x.replaceAll(" ", ""))), invalidMsg),
    ),
  ],
  invalidMsg,
);
export const optionalPhoneValidator = optional(phone);
export const nullishPhoneValidator = nullish(phone);

export const optionalEmailValidator = optional(
  pipe(
    string("Invalid email"),
    check((x) => !x || new RegExp(emailRegExp).test(x), "Invalid email"),
  ),
);

export const emailValidator = pipe(
  string("Invalid email"),
  nonEmpty("Email is required"),
  check((x) => new RegExp(emailRegExp).test(x), "Invalid email"),
);
