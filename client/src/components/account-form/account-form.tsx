import React from "react";

import "./account-form.scss";

export function AccountForm(props: React.HTMLAttributes<HTMLDivElement>) {
  const { className = "" } = props;

  return (
    <form
      className={`account-form ${className}`}
      id="form"
      action="/users"
      method="POST"
    >
      <div className="account-form__details-row">
        <label htmlFor="email">Email</label>
        <input id="email" type="text" className="text-input" />
      </div>
      <div className="account-form__details-row">
        <label htmlFor="username">Username</label>
        <input id="username" type="text" className="text-input" />
      </div>
      <div className="account-form__details-row">
        <label htmlFor="password">Password</label>
        <input id="password" type="text" className="text-input" />
      </div>
      <div className="account-form__details-row">
        <label htmlFor="new-password">New Password</label>
        <input id="new-password" type="text" className="text-input" />
      </div>
      <div className="account-form__save-btn">
        <button className="btn btn_theme_white">Save Changes</button>
      </div>
      <div className="account-form__btns">
        <button className="btn btn_theme_red">Delete Account</button>
        <button className="btn btn_theme_white">Log Out</button>
      </div>
    </form>
  );
}
