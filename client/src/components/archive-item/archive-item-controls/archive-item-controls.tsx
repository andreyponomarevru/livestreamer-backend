import React, { ReactElement } from "react";

import "../../lib/text-input/text-input.scss";

import "./archive-item-controls.scss";

export function ArchiveItemControls(
  props: React.HTMLAttributes<HTMLDivElement>
): ReactElement {
  const { className = "" } = props;

  const saveBtn = (
    <button className={`btn btn_theme_white ${className}`}>Save</button>
  );

  return (
    <div className="archive-item-controls">
      <div className="archive-item-controls__input-row">
        <span>Action</span>
        <div className="archive-item-controls__grouped-btns">
          <select
            name="limit"
            className="archive-item-controls__select-box"
            onChange={(e) => {
              /* props.handleChange(parseInt(e.target.value)}*/
            }}
            value="Unpublish"
          >
            <option value="publish">Publish Broadcast</option>
            <option value="unpublish">Unpublish Broadcast</option>
            <option value="delete">Delete Broadcast</option>
          </select>
          {saveBtn}
        </div>
      </div>
      <div className="archive-item-controls__input-row">
        <label htmlFor="tracklist">Tracklist</label>
        <div className="archive-item-controls__grouped-btns">
          <input id="tracklist" type="file" />
          {saveBtn}
        </div>
      </div>
      <div className="archive-item-controls__input-row">
        <label htmlFor="tracklist">Player Link</label>
        <div className="archive-item-controls__grouped-btns">
          <input
            type="text"
            className="archive-item-controls__text-input text-input"
          />
          {saveBtn}
        </div>
      </div>
    </div>
  );
}
