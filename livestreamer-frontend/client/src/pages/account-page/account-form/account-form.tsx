import * as React from "react";
import { useForm } from "react-hook-form";

import { inputRules, InputTypes } from "../../../config/input-rules";
import { useFetch } from "../../../hooks/use-fetch";
import { API_ROOT_URL } from "../../../config/env";
import { useAuthN } from "../../../hooks/use-authn";
import { User, UserResponse } from "../../../types";
import { Btn } from "../../../lib/btn/btn";
import { useIsMounted } from "../../../hooks/use-is-mounted";
import { useNavigate } from "react-router";
import { Loader } from "../../../lib/loader/loader";
import { FormError } from "../../../lib/form-error/form-error";
import { ROUTES } from "../../../config/routes";

import "./account-form.scss";

type UserSettings = { username: string };

function AccountForm(): React.ReactElement {
  function handleSaveChanges(userSettings: UserSettings) {
    clearErrors();
    sendUpdatedUserRequest(`${API_ROOT_URL}/user`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(userSettings),
    });
  }

  function handleChange() {
    clearErrors();
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
    setError,
    clearErrors,
  } = useForm<InputTypes>({
    mode: "onBlur",
    defaultValues: { username: auth.user?.username },
  });

  React.useEffect(() => {
    if (isMounted && auth.user) {
      setValue("username", auth.user.username, { shouldValidate: false });
    }
  }, [isMounted, auth.user]);

  const { state: updatedUserResponse, fetchNow: sendUpdatedUserRequest } =
    useFetch<UserResponse>();
  React.useEffect(() => {
    if (isMounted && updatedUserResponse.response?.body) {
      const user: User = updatedUserResponse.response.body.results;
      auth.setUser(user);
      navigate(ROUTES.root);
    } else if (isMounted && updatedUserResponse.error) {
      setError("username", {
        type: "string",
        message: updatedUserResponse.error.message,
      });
    }
  }, [isMounted, updatedUserResponse]);

  return (
    <form
      className="account-form"
      onSubmit={handleSubmit(handleSaveChanges, handleFormErrors)}
      onChange={handleChange}
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

      {errors.username && <FormError>{errors.username.message}</FormError>}

      <Btn theme="white" name="Save" isLoading={updatedUserResponse.isLoading}>
        <Loader for="btn" color="black" />
      </Btn>
    </form>
  );
}

export { AccountForm };
