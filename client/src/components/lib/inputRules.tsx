// validation schemas for react-hook-forms

export interface InputTypes {
  email: string;
  username: string;
  password: string;
  newPassword: string;
  playerLink: string;
  tracklist: unknown;
}

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
      value: 4,
      message: "Username must have at least 4 characters",
    },
  },
  password: {
    required: "Password is required",
    minLength: {
      value: 6,
      message: "Password must have at least 6 characters",
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
};
