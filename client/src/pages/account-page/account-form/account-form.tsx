import React, { ReactElement, useState, useEffect } from "react";
import { useForm } from "react-hook-form";

import { inputRules, InputTypes } from "../../../config/input-rules";
import { useFetch } from "../../../hooks/use-fetch";
import { API_ROOT_URL } from "../../../config/env";
import { useAuthN } from "../../../hooks/use-authn";
import { User, UserResponse } from "../../../types";
import { Btn } from "../../../lib/btn/btn";
import { useIsMounted } from "../../../hooks/use-is-mounted";

import "./account-form.scss";
import { useNavigate } from "react-router";

type UserSettings = {
  username: string;
};

function useMsg() {
  const [message, setMessage] = React.useState(null);

  return [message, setMessage];
}

export function AccountForm(): ReactElement {
  function handleSaveChanges(userSettings: UserSettings) {
    fetchUpdatedUserNow(`${API_ROOT_URL}/user`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(userSettings),
    });
  }

  function handleFormErrors(errors: unknown) {
    console.error(errors);
  }

  const auth = useAuthN();
  const isMounted = useIsMounted();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<InputTypes>({
    mode: "onBlur",
    defaultValues: { username: auth.user?.username },
  });

  useEffect(() => {
    if (isMounted && auth.user) {
      setValue("username", auth.user.username, { shouldValidate: false });
    }
  }, [isMounted, auth.user]);

  const [updatedUser, fetchUpdatedUserNow] = useFetch<UserResponse>();
  useEffect(() => {
    if (isMounted && updatedUser.response?.body) {
      const user: User = updatedUser.response.body.results;
      localStorage.setItem("user", JSON.stringify(user));
      auth.updateUser(user);
      navigate("/");
    }
  }, [isMounted, updatedUser]);

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
          {...register("username", inputRules.username)}
        />
      </div>

      {errors.username && (
        <small className="account-form__ form__text form__text_danger">
          {errors.username.message}
        </small>
      )}

      {updatedUser.error && (
        <div className="account-form__text_error">
          {updatedUser.error.message}
        </div>
      )}

      <Btn
        theme="white"
        defaultText="Save"
        className="account-form__save-btn"
      />
    </form>
  );
}
