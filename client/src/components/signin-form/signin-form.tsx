import React, { ReactElement } from "react";
import { NavLink } from "react-router-dom";

import "../lib/link/link.scss";
import "../lib/btn/btn.scss";
import "../lib/text-input/text-input.scss";

import "./signin-form.scss";

export function SignInForm(
  props: React.HTMLAttributes<HTMLDivElement>
): ReactElement {
  const { className = "" } = props;

  function setInputName(e: React.ChangeEvent<HTMLInputElement>) {
    if (/@/.test(e.target.value)) {
      // set input 'name' attr to 'email' or 'username' respectively
    }
  }

  // TODO: use formik!

  return (
    <form
      className={`signin-form ${className}`}
      id="form"
      action="/signup"
      method="POST"
    >
      <input
        className="signin-form__input text-input"
        type="text"
        name="email"
        placeholder="Email or username"
        onChange={setInputName}
      />
      <input
        className="signup-form__input text-input"
        type="text"
        name="password"
        placeholder="Password"
        onChange={setInputName}
      />
      <button className="btn btn_theme_white">Log In</button>
      <div className="signin-form__subtext">
        <NavLink to="/forgot-password" className="link">
          Forgot Password?
        </NavLink>
      </div>
    </form>
  );
}
