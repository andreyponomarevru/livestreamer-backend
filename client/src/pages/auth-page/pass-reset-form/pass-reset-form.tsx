import React, {
  ReactElement,
  Fragment,
  useState,
  useContext,
  useEffect,
} from "react";

import { useForm } from "react-hook-form";

import "../../../lib/btn/btn.scss";
import "../../../lib/text-input/text-input.scss";
import "../../../lib/btn/btn.scss";
import "../../../lib/form/form.scss";
import { inputRules, InputTypes } from "../../../config/input-rules";
import { API_ROOT_URL } from "../../../config/env";
import { Message } from "../../../lib/message/message";
import { useFetch } from "../../../hooks/useFetch";
import { Loader } from "../../../lib/loader/loader";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  token: string | null;
}

// http://mix.ru:8000/#/password-reset?token=aa7a7b15213bed12aecdbbab97cee4957a134c763c646733895275cc97d87916feb88801f6f9f70b28826b5cc44fbcda692e38b885113fd7b875dbc89155819b

export function PassResetForm(props: Props): ReactElement {
  const { className = "" } = props;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<InputTypes>({ mode: "onBlur" });

  async function handlePasswordReset({ password }: { password: string }) {
    if (!props.token) console.error("Token in query string is not set");

    sendNewPassword(`${API_ROOT_URL}/user/settings/password`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({ newPassword: password, token: props.token }),
    });

    reset();
  }

  function handleErrors(errors: unknown) {
    console.error(errors);
  }

  const [newPassword, sendNewPassword] = useFetch<null>();

  return (
    <form
      className={`form ${className}`}
      onSubmit={handleSubmit(handlePasswordReset, handleErrors)}
    >
      {newPassword.isLoading && <Loader />}

      {newPassword.response === null && (
        <Fragment>
          <div>Enter your new password below.</div>

          <div className="form__form-group">
            <label className="form__label" htmlFor="password" />
            <input
              className="form text-input"
              type="password"
              id="password"
              placeholder="New Password"
              {...register("password", inputRules.password)}
            />
            {errors.password && (
              <small className="form__text form__text_danger">
                {errors.password.message}
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
        </Fragment>
      )}

      {newPassword.response && (
        <Message type="success">
          Password successfully updated. You can now log in with your new
          password.
        </Message>
      )}

      {newPassword.error && (
        <Message type="danger">{newPassword.error.message}</Message>
      )}
    </form>
  );
}
