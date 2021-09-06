import React, { ReactElement } from "react";

import { NavLink } from "react-router-dom";
import { useForm } from "react-hook-form";

import "../lib/link/link.scss";
import "../lib/btn/btn.scss";
import "../lib/text-input/text-input.scss";
import "../lib/form/form.scss";

import { inputRules, InputTypes } from "../../components/lib/inputRules";

export function SignInForm(
  props: React.HTMLAttributes<HTMLDivElement>
): ReactElement {
  const { className = "" } = props;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<InputTypes>({ mode: "onBlur" });

  async function handleSignIn(data: unknown) {
    // TODO:
    // here we submit data to API like 'await login(data.email, data.password)'. Import the function calling the api from ../api/send-signup-form.tsx
    // and then call 'reset()'

    console.log(data);
  }

  function handleErrors(errors: unknown) {
    console.error(errors);
  }

  return (
    <form
      className={`form ${className}`}
      onSubmit={handleSubmit(handleSignIn, handleErrors)}
    >
      <div className="form__form-group">
        <label className="form__label" htmlFor="email" />
        <input
          className="form__input text-input"
          type="email"
          id="password"
          placeholder="Email"
          {...register("email", inputRules.email)}
        />
        {errors.email && (
          <small className="form__text form__text_danger">
            {errors.email.message}
          </small>
        )}
      </div>

      <div className="form__form-group">
        <label className="form__label" htmlFor="password" />
        <input
          className="form__input text-input"
          type="password"
          id="password"
          placeholder="Password"
          {...register("password", inputRules.password)}
        />
        {errors.password && (
          <small className="form__text form__text_danger">
            {errors.password.message}
          </small>
        )}
      </div>

      <button className="btn btn_theme_white">Log In</button>

      <small className="form__text form__text_regular">
        <NavLink to="/forgot-password" className="link">
          Forgot Password?
        </NavLink>
      </small>
    </form>
  );
}
