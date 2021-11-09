import React from "react";

import { useForm } from "react-hook-form";

import { inputRules, InputTypes } from "../../../config/input-rules";

export function PlayerLinkForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<InputTypes>({ mode: "onBlur" });

  async function handleSavePlayerLink(data: unknown) {
    // TODO:
    // here we submit data to API like 'await signup(data.email, data.username, data.password)'. Import the function calling the api from ../api/send-signup-form.tsx
    // and then call 'reset()'

    console.log(data);
  }
  function handleErrors(errors: unknown) {
    console.error(errors);
  }

  return (
    <form
      className="archive-item-controls__form-group"
      onSubmit={handleSubmit(handleSavePlayerLink, handleErrors)}
    >
      <label htmlFor="player-link" />
      <div className="archive-item-controls__grouped-btns">
        <input
          id="player-link"
          type="text"
          className="text-input"
          placeholder="Player Link (Mixcloud, Soundcloud, ...)"
          {...register("playerLink", inputRules.playerLink)}
        />
        <button className="btn btn_theme_white">Save Link</button>
      </div>
      {errors.playerLink && (
        <small className="form__text form__text_danger">
          {errors.playerLink.message}
        </small>
      )}
    </form>
  );
}
