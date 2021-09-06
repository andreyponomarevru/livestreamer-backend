import React, { ReactElement, Fragment } from "react";

import { useForm } from "react-hook-form";

import "./../lib/btn/btn.scss";
import "./../lib/text-input/text-input.scss";
import "./../lib/btn/btn.scss";
import "./../lib/form/form.scss";
import { inputRules, InputTypes } from "../../components/lib/inputRules";

export function ForgotPasswordForm(
  props: React.HTMLAttributes<HTMLDivElement>
): ReactElement {
  const { className = "" } = props;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<InputTypes>({ mode: "onBlur" });

  async function handlePasswordReset(data: unknown) {
    // TODO:
    // here we submit data to API like 'await resetPassword(data.email)'. Import the function calling the api from ../api/send-signup-form.tsx
    // and then call 'reset()'

    console.log(data);
  }
  function handleErrors(errors: unknown) {
    console.error(errors);
  }

  return (
    <form
      className={`form ${className}`}
      onSubmit={handleSubmit(handlePasswordReset, handleErrors)}
    >
      <div>
        Enter the email used for your account and we will send you a link to
        reset your password.
      </div>

      <div className="form__form-group">
        <label className="form__label" htmlFor="email" />
        <input
          className="form text-input"
          type="email"
          id="email"
          placeholder="Email"
          {...register("email", inputRules.email)}
        />
        {errors.email && (
          <small className="form__text form__text_danger">
            {errors.email.message}
          </small>
        )}
      </div>

      <button className="btn btn_theme_white">Submit</button>
      <div className="forgot-password-form__subtext">
        Need help?{" "}
        <a href="mailto:info@andreyponomarev.ru" className="link">
          Contact us
        </a>
      </div>
    </form>
  );
}
