import React from "react";

import { useForm } from "react-hook-form";

import { inputRules, InputTypes } from "../../../config/input-rules";

export function TracklistForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<InputTypes>({ mode: "onBlur" });

  async function handleUploadTracklist(data: unknown) {
    // TODO:
    // example of file uploading: https://stackoverflow.com/questions/64357440/files-not-getting-uploaded-from-react-hook-forms-to-backend-server
    // + https://www.newline.co/@satansdeer/handling-file-fields-using-react-hook-form--93ebef46
  }
  function handleErrors(errors: unknown) {
    console.error(errors);
  }

  return (
    <form
      className="archive-item-controls__form-group"
      onSubmit={handleSubmit(handleUploadTracklist, handleErrors)}
    >
      <label htmlFor="tracklist">Tracklist</label>
      <div className="archive-item-controls__grouped-btns">
        <input
          id="tracklist"
          type="file"
          accept="image/*"
          {...register("tracklist")}
        />
        <button className="btn btn_theme_white">Save Tracklist</button>
      </div>
      {errors.tracklist && (
        <small className="form__text form__text_danger">
          Something is wrong :(
        </small>
      )}
    </form>
  );
}
