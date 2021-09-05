import React, { ReactElement } from "react";

import "../lib/btn/btn.scss";

import "./schedule-form.scss";

export function ScheduleForm(): ReactElement {
  function handleDatetimeChange(e: React.ChangeEvent<HTMLInputElement>): void {
    console.log(e.target.value);
  }

  // TODO: set the min value of both inputs to current day/time

  return (
    <form className="schedule-form">
      <label htmlFor="broadcast-start-time">
        Choose a <em>start</em> time for your broadcast:
      </label>
      <input
        type="datetime-local"
        id="broadcast-start-time"
        name="broadcast-start-time"
        value="2018-06-12T19:30"
        min="2018-06-07T00:00"
        max="2018-06-14T00:00"
        onChange={handleDatetimeChange}
      ></input>
      <label htmlFor="broadcast-end-time">
        Choose an <em>end</em> time for your broadcast:
      </label>
      <input
        type="datetime-local"
        id="broadcast-end-time"
        name="broadcast-end-time"
        value="2018-06-12T19:30"
        onChange={handleDatetimeChange}
      ></input>
      <button className="btn btn_theme_white schedule_btn">Schedule</button>
    </form>
  );
}
