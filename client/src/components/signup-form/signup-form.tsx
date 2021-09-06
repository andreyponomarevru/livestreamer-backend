import React, { ReactElement } from "react";

import { useForm } from "react-hook-form";

import "../lib/text-input/text-input.scss";
import "../lib/btn/btn.scss";
import "../lib/link/link.scss";
import { inputRules, InputTypes } from "../lib/inputRules";
import "../lib/form/form.scss";

export function SignUpForm(
  props: React.HTMLAttributes<HTMLDivElement>
): ReactElement {
  const { className = "" } = props;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<InputTypes>({ mode: "onBlur" });

  async function handleSignUp(data: unknown) {
    // TODO:
    // here we submit data to API like 'await signup(data.email, data.username, data.password)'. Import the function calling the api from ../api/send-signup-form.tsx
    // and then call 'reset()'

    console.log(data);
  }
  function handleErrors(errors: unknown) {
    console.error(errors);
  }

  return (
    <form
      className={`form ${className}`}
      onSubmit={handleSubmit(handleSignUp, handleErrors)}
    >
      <div className="form__form-group">
        <label className="form__label" htmlFor="email" />
        <input
          className="form__input text-input"
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

      <div className="form__form-group">
        <label className="form__label" htmlFor="username" />
        <input
          className="form__input text-input"
          type="text"
          id="username"
          placeholder="Username"
          {...register("username", inputRules.username)}
        />
        <small className="form__text form__text_danger">
          {errors.username?.message}
        </small>
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
        <small className="form__text form__text_danger">
          {errors.password?.message}
        </small>
      </div>

      <input type="submit" value="Sign Up" className="btn btn_theme_white" />
    </form>
  );
}
