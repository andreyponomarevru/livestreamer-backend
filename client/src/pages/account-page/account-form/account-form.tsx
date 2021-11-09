import React, { ReactElement, useState, useEffect } from "react";
import { useForm } from "react-hook-form";

import { inputRules, InputTypes } from "../../../config/input-rules";
import { useFetch } from "../../../hooks/useFetch";
import { API_ROOT_URL } from "../../../config/env";
import { useAuthN } from "../../../hooks/use-authn";
import { User, UserResponse } from "../../../types";
import { Btn } from "../../../lib/btn/btn";
import { useIsMounted } from "../../../hooks/use-is-mounted";

import "./account-form.scss";

type UserSettings = {
  username: string;
};

export function AccountForm(): ReactElement {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<InputTypes>({ mode: "onBlur" });

  function handleSaveChanges(userSettings: UserSettings) {
    //setErrResponse(null);
    //setSuccessResponse(null);
    fetchUpdatedUserNow(`${API_ROOT_URL}/user`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(userSettings),
    });

    reset();
  }

  function handleFormErrors(errors: unknown) {
    //setErrResponse(null);
    // setSuccessResponse(null);
    console.error(errors);
  }

  function handleUsernameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setUsername(e.target.value);
  }

  const { user, updateUser } = useAuthN();

  const [username, setUsername] = useState(user?.username);

  const isMounted = useIsMounted();
  const [updatedUser, fetchUpdatedUserNow] = useFetch<UserResponse>();
  useEffect(() => {
    if (isMounted && updatedUser.response?.body) {
      const user: User = updatedUser.response.body.results;
      localStorage.setItem("user", JSON.stringify(user));
      updateUser(user);
    }
  }, [isMounted, updatedUser, user]);

  //const [successResponse, setSuccessResponse] = useState<string | null>(null);
  //const [errResponse, setErrResponse] = useState<string | null>(null);

  return (
    <form
      className="account-form"
      onSubmit={handleSubmit(handleSaveChanges, handleFormErrors)}
    >
      <div className="account-form__details-row">
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          className="text-input"
          value={username}
          {...register("username", inputRules.username)}
          onChange={handleUsernameChange}
        />
      </div>

      {errors.username && (
        <small className="account-form__ form__text form__text_danger">
          {errors.username.message}
        </small>
      )}

      {updatedUser.response && (
        <div className="account-form__text_success">
          Username successfully updated
        </div>
      )}
      {updatedUser.error && (
        <div className="account-form__text_error">
          {updatedUser.error.message}
        </div>
      )}

      <Btn
        theme="white"
        type="input"
        defaultText="Save"
        className="account-form__save-btn"
      />
    </form>
  );
}
