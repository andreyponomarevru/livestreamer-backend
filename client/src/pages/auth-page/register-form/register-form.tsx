import * as React from "react";
import { useForm } from "react-hook-form";

import "../../../lib/text-input/text-input.scss";
import "../../../lib/btn/btn.scss";
import "../../../lib/link/link.scss";
import "../../../lib/form/form.scss";

import { inputRules, InputTypes } from "../../../config/input-rules";
import { API_ROOT_URL } from "../../../config/env";
import { RegisterForm } from "../../../types";
import { useIsMounted } from "../../../hooks/use-is-mounted";
import { useFetch } from "../../../hooks/use-fetch";
import { Loader } from "../../../lib/loader/loader";
import { useNavigate } from "react-router";
import { Btn } from "../../../lib/btn/btn";
import { ROUTES } from "../../../config/routes";
import { FormError } from "../../../lib/form-error/form-error";

export function RegisterForm(
  props: React.HTMLAttributes<HTMLDivElement>
): React.ReactElement {
  function handleSignUp(form: RegisterForm) {
    console.log("[handleSignup handler]", form);

    clearErrors();

    sendRegisterRequest(`${API_ROOT_URL}/user`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accept: "application/json",
        authorization: `Basic ${btoa(`${form.username}:${form.password}`)}`,
      },
      body: JSON.stringify({ email: form.email }),
    });
  }

  function handleErrors(errors: unknown) {
    console.error(errors);
  }

  function handleChange() {
    clearErrors();
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<InputTypes>({ mode: "onBlur" });
  const navigate = useNavigate();
  const isMounted = useIsMounted();
  const { state: registerResponse, fetchNow: sendRegisterRequest } = useFetch();
  React.useEffect(() => {
    if (isMounted && registerResponse.response) {
      navigate(ROUTES.confirmationRequired);
    } else if (isMounted && registerResponse.error) {
      setError("username", {
        type: "string",
        message: registerResponse.error.message,
      });
    }
  }, [isMounted, registerResponse]);

  return (
    <form
      className={`form ${props.className || ""}`}
      onSubmit={handleSubmit(handleSignUp, handleErrors)}
      onChange={handleChange}
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
        {errors.email && <FormError>{errors.email.message}</FormError>}
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
        {errors.username && <FormError> {errors.username?.message}</FormError>}
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
        {errors.password && <FormError>{errors.password.message}</FormError>}
      </div>

      <Btn
        isLoading={registerResponse.isLoading}
        name="Create Account"
        className="btn btn_theme_white"
        theme="white"
      >
        <Loader for="btn" color="black" />
      </Btn>
    </form>
  );
}
