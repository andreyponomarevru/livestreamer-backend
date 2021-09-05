import React, { ReactElement, Fragment } from "react";

import "./../lib/btn/btn.scss";
import "./../lib/text-input/text-input.scss";
import "./../lib/btn/btn.scss";

import "./forgot-password-form.scss";

export function ForgotPasswordForm(
  props: React.HTMLAttributes<HTMLDivElement>
): ReactElement {
  const { className = "" } = props;

  return (
    <form
      className={`forgot-password-form ${className}`}
      id="form"
      action="/password-reset"
      method="POST"
    >
      <div>
        Enter the email used for your account and we will send you a link to
        reset your password.
      </div>
      <input
        className="forgot-password-form text-input"
        type="text"
        name="email"
        placeholder="Email or username"
      />
      <button className="btn btn_theme_white">Log In</button>
      <div className="forgot-password-form__subtext">
        Need help?{" "}
        <a href="mailto:info@andreyponomarev.ru" className="link">
          Contact us
        </a>
      </div>
    </form>
  );
}
