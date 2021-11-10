import React, { ReactElement, useState, Fragment } from "react";
import { useForm } from "react-hook-form";

import "../../../lib/text-input/text-input.scss";
import "../../../lib/btn/btn.scss";
import "../../../lib/link/link.scss";
import "../../../lib/form/form.scss";

import { inputRules, InputTypes } from "../../../config/input-rules";
import { API_ROOT_URL } from "../../../config/env";
import { parseResponse } from "../../../utils/parse-response";
import { handleResponseErr } from "../../../utils/handle-response-err";
import { Message } from "../../../lib/message/message";
import { AskToConfirmRegistrationPage } from "../../ask-to-confirm-registration/ask-to-confirm-registration";
import { RegisterForm } from "../../../types";

// TODO: fix, this var is undefined
// const { REACT_APP_API_ROOT } = process.env;
const REACT_APP_API_ROOT = "http://localhost:5000/api/v1";

export function RegisterForm(
  props: React.HTMLAttributes<HTMLDivElement>
): ReactElement {
  function handleSignUp(form: RegisterForm) {
    /*
    setSuccessResponse(undefined);
    setErrResponse(null);
    console.log("[handleSignup handler]", form);

    const request: RequestInit = {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accept: "application/json",
        authorization: `Basic ${btoa(`${form.username}:${form.password}`)}`,
      },
      body: JSON.stringify({ email: form.email }),
    };
    fetch(`${API_ROOT_URL}/user`, request)
      .then(parseResponse)
      .then(() => setSuccessResponse(true))
      .catch((err) => handleResponseErr(err, setErrResponse));
    */
    //reset();
  }

  function handleErrors(errors: unknown) {
    console.error(errors);
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<InputTypes>({ mode: "onBlur" });

  const [successResponse, setSuccessResponse] = useState<boolean>();
  const [errResponse, setErrResponse] = useState<null | string>(null);

  if (successResponse) {
    // TODOL instead of rendering this code, redirect to this page: AskToConfirmRegistrationPage
    return (
      <div className={`form ${props.className || ""}`}>
        <AskToConfirmRegistrationPage />
      </div>
    );
  } else {
    return (
      <form
        className={`form ${props.className || ""}`}
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

        <input
          type="submit"
          value="Create Account"
          className="btn btn_theme_white"
        />

        {errResponse && <Message type="danger">{errResponse}</Message>}
      </form>
    );
  }
}
