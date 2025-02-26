// validation schemas for react-hook-forms

export interface InputTypes {
  email: string;
  username: string;
  password: string;
  newPassword: string;
  playerLink: string;
  tracklist: unknown;
  emailOrUsername: string;
}

export const asciiRegex = new RegExp("^[\x00-\x7F]+$");
export const alphaNumericRegex = new RegExp("^[a-zA-Z0-9]+$");

export const inputRules = {
  email: {
    required: "Email is required",
    pattern: {
      value:
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      message: "Entered value does not match email format",
    },
  },
  username: {
    required: "Username is required",
    minLength: {
      value: 3,
      message: "Username must have at least 3 characters",
    },
    maxLength: {
      value: 15,
      message: "Username length must not exceed 15 characters",
    },
    pattern: {
      value: alphaNumericRegex,
      message: "You may only use the characters A to Z, a to z and 0 to 9",
    },
  },
  password: {
    required: "Password is required",
    minLength: {
      value: 6,
      message: "Password must have at least 6 characters",
    },
    maxLength: {
      value: 50,
      message: "Password must not exceed 50 characters",
    },
    pattern: {
      value: asciiRegex,
      message:
        "You may only use the characters A to Z, a to z, 0 to 9, and simple punctuation in your password",
    },
  },
  playerLink: {
    required: "Player link is required",
    minLength: {
      value: 6,
      message: "Player link must have at least 6 characters",
    },
  },
  tracklist: {
    required: "Tracklist is required",
  },
  signInEmailOrUsername: {
    required: "Email or username is required",
  },
  signInPassword: {
    required: "Password is required",
  },
};
