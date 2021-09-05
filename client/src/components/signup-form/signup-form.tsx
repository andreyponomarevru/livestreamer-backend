import React, { ReactElement } from "react";

import "../lib/text-input/text-input.scss";
import "../lib/btn/btn.scss";
import "../lib/link/link.scss";

import "./signup-form.scss";

export function SignUpForm(
  props: React.HTMLAttributes<HTMLDivElement>
): ReactElement {
  const { className = "" } = props;

  // TODO: maybe move 'onChange' to helper functions and implement validation inside it?
  function onChange() {}

  return (
    <form
      className={`signup-form ${className}`}
      id="form"
      action="/signup"
      method="POST"
    >
      <label className="signup-form__label" htmlFor="email">
        <input
          className="signup-form__input text-input"
          type="text"
          name="email"
          placeholder="Email"
          onChange={onChange}
        />
      </label>
      <label className="signup-form__label" htmlFor="username">
        <input
          className="signup-form__input text-input"
          type="text"
          name="username"
          placeholder="Username"
          onChange={onChange}
        />
        <div className="signup-form__subtext">At least 4 characters</div>
      </label>
      <label className="signup-form__label" htmlFor="password">
        <input
          className="signup-form__input text-input"
          type="text"
          name="password"
          placeholder="Password"
          onChange={onChange}
        />
        <small className="signup-form__subtext">At least 6 characters</small>
      </label>
      <input type="submit" value="Sign Up" className="btn btn_theme_white" />
    </form>
  );
}
