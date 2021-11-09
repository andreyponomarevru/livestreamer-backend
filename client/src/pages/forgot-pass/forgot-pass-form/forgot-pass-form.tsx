import React, { ReactElement, useState, useEffect, Fragment } from "react";

import { useForm } from "react-hook-form";

import "../../../lib/btn/btn.scss";
import "../../../lib/text-input/text-input.scss";
import "../../../lib/btn/btn.scss";
import "../../../lib/form/form.scss";

import { inputRules, InputTypes } from "../../../config/input-rules";
import { API_ROOT_URL } from "../../../config/env";
import { Message } from "../../../lib/message/message";
import { useIsMounted } from "../../../hooks/use-is-mounted";
import { useFetch } from "../../../hooks/use-fetch";
import { Loader } from "../../../lib/loader/loader";
import { Help } from "../../../lib/help/help";

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

  function handlePasswordReset(email: { email: string }) {
    // setSuccessResponse(undefined);
    // setErrResponse(null);

    requestPasswordReset(`${API_ROOT_URL}/user/settings/password`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(email),
    });

    setIsResetLinkSet(true); // ??? refactoor

    reset();
  }

  function handleErrors(errors: unknown) {
    console.error(errors);
  }

  const isMounted = useIsMounted();
  const [response, requestPasswordReset] = useFetch<null>();

  const [isResetLinkSent, setIsResetLinkSet] = useState(false);
  useEffect(() => {
    if (isMounted && response.response) {
    }
  }, [isMounted, response]);

  /*
  if (response) {
    return (
      <div className="form">
        <Message type="success" className=" message__form">
          Password reset link has been sent to your email.
        </Message>
      </div>
    );
  } */

  return (
    <form
      className={`form ${className}`}
      onSubmit={handleSubmit(handlePasswordReset, handleErrors)}
    >
      {response.isLoading && <Loader />}

      {response.error && (
        <Message type="danger" className=" message__form">
          {response.error.message}
        </Message>
      )}

      {!response.response && (
        <Fragment>
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
          <Help />
        </Fragment>
      )}
    </form>
  );
}
