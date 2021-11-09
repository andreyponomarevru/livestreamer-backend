import React, { ReactElement } from "react";
import { NavLink } from "react-router-dom";

import { Icon } from "../../../lib/icon/icon";
import "../../lib/btn/btn.scss";

import "./no-bookmarks-msg.scss";

export function NoBookmarksMsg(): ReactElement {
  return (
    <div className="no-bookmarks-msg">
      <p className="no-bookmarks-msg__main-text">Nothing saved yet :(</p>
      <p className="no-bookmarks-msg__sub-text">
        Tap <Icon name="bookmark" className="no-bookmarks-msg__icon" />
        to add episodes to Bookmarks
      </p>

      <NavLink to="/archive" className="btn btn_theme_white no-bookmarks__btn">
        Discover Episodes
      </NavLink>
    </div>
  );
}
