import * as React from "react";
import { useForm } from "react-hook-form";

import "../../../lib/btn/btn.scss";
import "../../../lib/text-input/text-input.scss";
import "../../../lib/btn/btn.scss";
import "../../../lib/form/form.scss";

import { inputRules, InputTypes } from "../../../config/input-rules";
import { API_ROOT_URL } from "../../../config/env";
import { Message } from "../../../lib/message/message";
import { useFetch } from "../../../hooks/use-fetch";
import { Loader } from "../../../lib/loader/loader";
import { Btn } from "../../../lib/btn/btn";
import { useIsMounted } from "../../../hooks/use-is-mounted";
import { FormError } from "../../../lib/form-error/form-error";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../../../config/routes";
import { useQuery } from "../../../hooks/use-query";

export function PassResetForm(
  props: React.HTMLAttributes<HTMLDivElement>
): React.ReactElement {
  async function handlePasswordReset({ password }: { password: string }) {
    clearErrors();

    sendNewPasswordRequest(`${API_ROOT_URL}/user/settings/password`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({ newPassword: password, token: token }),
    });

    reset();
  }

  function handleErrors(errors: unknown) {
    console.error(errors);
  }

  const navigate = useNavigate();
  const query = useQuery();
  const token = query.get("token");
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    clearErrors,
    setError,
  } = useForm<InputTypes>({ mode: "onBlur" });
  const isMounted = useIsMounted();
  const { state: newPasswordResponse, fetchNow: sendNewPasswordRequest } =
    useFetch<null>();
  React.useEffect(() => {
    if (isMounted && newPasswordResponse.error) {
      setError("password", {
        type: "string",
        message: newPasswordResponse.error.message,
      });
    }
  }, [isMounted, newPasswordResponse]);

  React.useEffect(() => {
    if (isMounted && !token) {
      console.log("[PassResetForm] Token in query string is not set");
      navigate(ROUTES.root);
    }
  }, [isMounted]);

  return (
    <form
      className={`form ${props.className || ""}`}
      onSubmit={handleSubmit(handlePasswordReset, handleErrors)}
    >
      {newPasswordResponse.isLoading && <Loader for="page" color="pink" />}

      {newPasswordResponse.response === null && (
        <React.Fragment>
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
              <FormError>{errors.password.message}</FormError>
            )}
          </div>

          <Btn
            name="Submit"
            theme="white"
            isLoading={newPasswordResponse.isLoading}
          >
            <Loader color="black" for="btn" />
          </Btn>

          <div>
            Need help?{" "}
            <a href="mailto:info@andreyponomarev.ru" className="link">
              Contact us
            </a>
          </div>
        </React.Fragment>
      )}

      {newPasswordResponse.response && (
        <Message type="success">
          Password successfully updated. You can now{" "}
          <Link to={ROUTES.signIn}>log in</Link> with your new password.
        </Message>
      )}
    </form>
  );
}
