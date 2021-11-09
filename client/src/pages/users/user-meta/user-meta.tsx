import React, { useState } from "react";

import "./user-meta.scss";
import { UserResponse, User } from "../../../types";

export function UserMeta(props: User) {
  const [isOpen, setIsOpen] = useState(false);

  function toggleDetails() {
    setIsOpen((prev) => !prev);
  }

  const detailsJSX = (
    <div className="user-meta__details">
      <div className="user-meta__details-row">
        <span className="user-meta__key">Email</span>
        <span className="user-meta__value">{props.email}</span>
      </div>
      <div className="user-meta__details-row">
        <button className="btn btn_theme_white">Delete</button>
      </div>
    </div>
  );

  return (
    <div className="user-meta">
      <button className="user-meta__btn" onClick={toggleDetails}>
        {props.username}
        <span>+</span>
      </button>
      {isOpen && detailsJSX}
    </div>
  );
}
