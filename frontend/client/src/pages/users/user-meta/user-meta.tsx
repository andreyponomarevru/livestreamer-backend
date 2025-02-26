import React, { useState } from "react";

import "./user-meta.scss";
import { User } from "../../../types";
import { Btn } from "../../../lib/btn/btn";
import { Loader } from "../../../lib/loader/loader";

function UserMeta(props: User) {
  const [isOpen, setIsOpen] = useState(false);

  function toggleDetails() {
    setIsOpen((prev) => !prev);
  }

  // TODO: send request to API

  const detailsJSX = (
    <div className="user-meta__details">
      <div className="user-meta__details-row">
        <span className="user-meta__key">Email</span>
        <span className="user-meta__value">{props.email}</span>
      </div>
      <div className="user-meta__details-row">
        <Btn theme="white" name="Delete" isLoading={false}>
          <Loader color="black" for="btn" />
        </Btn>
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

export { UserMeta };
