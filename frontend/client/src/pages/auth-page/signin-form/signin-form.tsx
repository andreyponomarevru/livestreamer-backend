import React from "react";

import { NavLink, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import "../../../lib/link/link.scss";
import "../../../lib/btn/btn.scss";
import "../../../lib/text-input/text-input.scss";
import "../../../lib/form/form.scss";
import { inputRules, InputTypes } from "../../../config/input-rules";
import { isEmail } from "../../../utils/is-email";
import { SignInForm } from "../../../types";
import { Btn } from "../../../lib/btn/btn";
import { useIsMounted } from "../../../hooks/use-is-mounted";
import { useSignIn } from "../../../hooks/use-sign-in";
import { FormError } from "../../../lib/form-error/form-error";
import { Loader } from "../../../lib/loader/loader";
import { ROUTES } from "../../../config/routes";
import { useAuthN } from "../../../hooks/use-authn";

function SignInForm(
  props: React.HTMLAttributes<HTMLDivElement>
): React.ReactElement {
  const handleSignIn = async ({ emailOrUsername, password }: SignInForm) => {
    clearErrors();
    isEmail(emailOrUsername)
      ? signIn({ email: emailOrUsername, password })
      : signIn({ username: emailOrUsername, password });
  };

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
    clearErrors,
    setError,
  } = useForm<InputTypes>({ mode: "onBlur" });
  const navigate = useNavigate();
  const isMounted = useIsMounted();
  const { signIn, signInResponse } = useSignIn();
  const { setUser } = useAuthN();
  React.useEffect(() => {
    if (isMounted && signInResponse.error) {
      setError("password", {
        type: "string",
        message: signInResponse.error.message,
      });
    } else if (isMounted && signInResponse.response?.body) {
      const user = signInResponse.response.body.results;
      setUser(user);
      navigate(ROUTES.root);
      window.location.reload();
    }
  }, [isMounted, signInResponse]);

  return (
    <form
      className={`form ${props.className || ""}`}
      onSubmit={handleSubmit(handleSignIn, handleErrors)}
      onChange={handleChange}
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
          <FormError>{errors.emailOrUsername.message}</FormError>
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
        {errors.password && <FormError>{errors.password.message}</FormError>}
      </div>

      <Btn name="Log In" theme="white" isLoading={signInResponse.isLoading}>
        <Loader color="black" for="btn" />
      </Btn>

      <p>
        <NavLink to="/forgot-pass" className="link">
          Forgot Password?
        </NavLink>
      </p>
    </form>
  );
}

export { SignInForm };
