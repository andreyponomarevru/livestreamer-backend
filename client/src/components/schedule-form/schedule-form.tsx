import React, { ReactElement, useState, useEffect } from "react";

import "../lib/btn/btn.scss";

import "./schedule-form.scss";

export function ScheduleForm(): ReactElement {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [broadcastTitle, setBroadcastTitle] = useState("");

  function handleDatetimeChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.name === "broadcast-start") {
      setStartDate(e.target.value);
    }

    if (e.target.name === "broadcast-end") {
      setEndDate(e.target.value);
    }
  }

  function handleBroadcastTitleInput(e: React.ChangeEvent<HTMLInputElement>) {
    setBroadcastTitle(e.target.value);
  }

  async function handleScheduleBroadcast(e: React.MouseEvent<HTMLElement>) {
    e.preventDefault();
    if (startDate === "" || endDate === "" || broadcastTitle === "")
      console.error(
        "Fill in the broadcast title and choose start and end dates"
      );
    else {
      // TODO:
      // import here function calling the API

      const JSON = {
        title: broadcastTitle,
        startAt: startDate,
        endAt: endDate,
      };
      console.log(JSON);
    }
  }

  useEffect(() => {
    console.log(`${startDate} — ${endDate}`);
  });

  // TODO:
  // set the min value of both inputs to current day/time

  return (
    <form className="schedule-form">
      <label htmlFor="broadcast-title"></label>
      <input
        id="broadcast-title"
        type="text"
        placeholder="Broadcast title"
        onChange={handleBroadcastTitleInput}
      />
      <label htmlFor="broadcast-start">
        Choose a <em>start</em> time for your broadcast:
      </label>
      <input
        type="datetime-local"
        id="broadcast-start"
        name="broadcast-start"
        min="2020-06-07T00:00"
        onChange={handleDatetimeChange}
      />
      <label htmlFor="broadcast-end">
        Choose an <em>end</em> time for your broadcast:
      </label>
      <input
        type="datetime-local"
        id="broadcast-end"
        name="broadcast-end"
        min="2020-06-07T00:00"
        onChange={handleDatetimeChange}
      />
      <button
        onClick={handleScheduleBroadcast}
        className="btn btn_theme_white schedule_btn"
      >
        Schedule
      </button>
    </form>
  );
}
