import React, { useState } from "react";

import "./user-meta.scss";

export function UserMeta() {
  // Mock API response
  const apiResponse = {
    username: "johndoe",
    role: "admin",
    is_confirmed: true,
    create_at: "12092009",
    last_login_at: "12102001",
    email: "info@test.ru",
  };

  const [isOpen, setIsOpen] = useState(false);

  function toggleDetails() {
    setIsOpen((prev) => !prev);
  }

  const detailsJSX = (
    <div className="user-meta__details">
      <div className="user-meta__details-row">
        <span className="user-meta__key">Role</span>
        <span className="user-meta__value">{apiResponse.role}</span>
      </div>
      <div className="user-meta__details-row">
        <span className="user-meta__key">Confirmed</span>
        <span className="user-meta__value">
          {apiResponse.is_confirmed.toString()}
        </span>
      </div>
      <div className="user-meta__details-row">
        <span className="user-meta__key">Email</span>
        <span className="user-meta__value">{apiResponse.email}</span>
      </div>
      <div className="user-meta__details-row">
        <span className="user-meta__key">Created at</span>
        <span className="user-meta__value">{apiResponse.create_at}</span>
      </div>
      <div className="user-meta__details-row">
        <span className="user-meta__key">Last Login</span>
        <span className="user-meta__value">{apiResponse.last_login_at}</span>
      </div>
      <div className="user-meta__details-row">
        <button className="btn btn_theme_white">Delete</button>
      </div>
    </div>
  );

  return (
    <div className="user-meta">
      <button className="user-meta__btn" onClick={toggleDetails}>
        {apiResponse.username}
        <span>+</span>
      </button>
      {isOpen && detailsJSX}
    </div>
  );
}
