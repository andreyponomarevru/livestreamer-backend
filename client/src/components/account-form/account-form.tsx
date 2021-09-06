import React, { ReactElement, useState } from "react";

import { useForm } from "react-hook-form";

import "./account-form.scss";
import { inputRules, InputTypes } from "../../components/lib/inputRules";

export function AccountForm(
  props: React.HTMLAttributes<HTMLDivElement>
): ReactElement {
  const { className = "" } = props;

  const apiResponse = { email: "info@johndoe.com", username: "johndoe" };

  const [email, setEmail] = useState(apiResponse.email);
  const [username, setUsername] = useState(apiResponse.username);

  async function handleUsernameChange() {}

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<InputTypes>({ mode: "onBlur" });

  async function handleSaveChanges(data: unknown) {
    // TODO:
    // here we submit data to API like 'await signup(data.email, data.username, data.password)'. Import the function calling the api from ../api/send-signup-form.tsx
    // and then call 'reset()'

    // handleUsernameChange
    // TODO:
    // send API requests to check for te existance of the username, if it exist, dispaly error

    // handleEmailChange
    // TODO:
    // send API requests to check for te existance of the email, if it exist, dispaly error. If not, after pressin Save Changes display "Confirmation link have been sent to the provided email"

    console.log(data);
  }
  function handleErrors(errors: unknown) {
    console.error(errors);
  }

  return (
    <form
      className={`account-form ${className}`}
      onSubmit={handleSubmit(handleSaveChanges, handleErrors)}
    >
      <div className="account-form__details-row">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="eamil"
          className="text-input"
          value={apiResponse.email}
          {...register("email", inputRules.email)}
        />
        {errors.email && (
          <small className="form__text form__text_danger">
            {errors.email.message}
          </small>
        )}
      </div>
      <div className="account-form__details-row">
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          className="text-input"
          value={apiResponse.username}
          {...register("username", inputRules.username)}
        />
        {errors.username && (
          <small className="form__text form__text_danger">
            {errors.username.message}
          </small>
        )}
      </div>

      <div className="account-form__save-btn">
        <button className="btn btn_theme_white">Save Changes</button>
      </div>
    </form>
  );
}
