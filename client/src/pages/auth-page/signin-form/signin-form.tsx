import React, { ReactElement, useContext, useEffect } from "react";

import { NavLink } from "react-router-dom";
import { useForm } from "react-hook-form";

import "../../../lib/link/link.scss";
import "../../../lib/btn/btn.scss";
import "../../../lib/text-input/text-input.scss";
import "../../../lib/form/form.scss";
import { inputRules, InputTypes } from "../../../config/input-rules";
import { useAuthN } from "../../../hooks/use-authn";
import { isEmail } from "../../../utils/is-email";
import { SignInForm } from "../../../types";
import { Message } from "../../../lib/message/message";

export function SignInForm(
  props: React.HTMLAttributes<HTMLDivElement>
): ReactElement {
  const handleSignIn = async ({ emailOrUsername, password }: SignInForm) => {
    isEmail(emailOrUsername)
      ? signin({ email: emailOrUsername, password })
      : signin({ username: emailOrUsername, password });
  };

  const handleErrors = (errors: unknown) => console.error(errors);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<InputTypes>({ mode: "onBlur" });

  const { user, signin, setErr, err } = useAuthN();

  useEffect(() => {
    if (err) setErr(null);
  }, []);

  return (
    <form
      className={`form ${props.className || ""}`}
      onSubmit={handleSubmit(handleSignIn, handleErrors)}
    >
      <div className="form__form-group">
        <label className="form__label" htmlFor="emailorusername" />
        <input
          className="form__input text-input"
          type="emailorusername"
          id="emailorusername"
          placeholder="Email or username"
          {...register("emailOrUsername", inputRules.signInEmailOrUsername)}
        />
        {errors.emailOrUsername && (
          <small className="form__text form__text_danger">
            {errors.emailOrUsername.message}
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
          {...register("password", inputRules.signInPassword)}
        />
        {errors.password && (
          <small className="form__text form__text_danger">
            {errors.password.message}
          </small>
        )}
      </div>

      <button className="btn btn_theme_white">Log In</button>

      {err && <Message type="danger">{err.message}</Message>}

      <small className="form__text form__text_regular">
        <NavLink to="/forgot-pass" className="link">
          Forgot Password?
        </NavLink>
      </small>
    </form>
  );
}
