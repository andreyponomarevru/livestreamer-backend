import React, { ReactElement } from "react";
import { NavLink } from "react-router-dom";

import { Icon } from "../lib/icon/icon";
import "./../lib/btn/btn.scss";
import "../lib/btn/btn.scss";

import "./empty-bookmarks-msg.scss";

export function EmptyBookmarksMsg(): ReactElement {
  return (
    <div className="empty-bookmarks-msg">
      <p className="empty-bookmarks-msg__main-text">Nothing saved yet :(</p>
      <p className="empty-bookmarks-msg__sub-text">
        Tap <Icon iconName="bookmark" className="empty-bookmarks-msg__icon" />
        to add episodes to Bookmarks
      </p>

      <NavLink
        to="/archive"
        className="btn btn_theme_white empty-bookmarks__btn"
      >
        Discover Episodes
      </NavLink>
    </div>
  );
}
