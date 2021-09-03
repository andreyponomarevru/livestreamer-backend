import React, { ReactElement } from "react";

import icons from "./../../icons.svg";
import "./archive-item.scss";

interface ArchiveItemProps {
  className?: string;
}

export function ArchiveItem(
  props: React.HTMLAttributes<HTMLDivElement>
): ReactElement {
  const { className = "" } = props;

  return (
    <div className={`archive-item ${className}`}>
      <div className="archive-item__meta">
        <span className="archive-item__date">23.1.2013</span>
        <span className="archive-item__listeners">
          Max Listeners: <span className="archive-item__count">7</span>
        </span>
        <span className="archive-item__hearts">
          Hearts: <span className="archive-item__count">23</span>
        </span>
      </div>
      <h3 className="archive-item__heading">Test Stream</h3>
      <div className="archive-item__description">
        Some short detxt description of this show that should not exceed 255
        characters it'l like a smal tweet, just put soming here and that's it
      </div>
      <div className="archive-item__controls">
        <button className={`menu-btn ${className}`}>
          <svg className="menu-btn__icon">
            <use href={`${icons}#tracklist`} />
          </svg>
        </button>
        <button className={`menu-btn ${className}`}>
          <svg className="menu-btn__icon">
            <use href={`${icons}#bookmark`} />
          </svg>
        </button>
        <button className={`menu-btn ${className}`}>
          <svg className="menu-btn__icon">
            <use href={`${icons}#download`} />
          </svg>
        </button>
      </div>
    </div>
  );
}

/*
import React, { ReactElement } from "react";

import icons from "./../../icons.svg";
import "./menu-btn.scss";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  handleBtnClick: () => void;
  isMenuOpen: boolean;
}

export function MenuBtn(props: Props): ReactElement {
  const { className = "" } = props;

  return (
    <button
      className={`menu-btn ${className}`}
      onClick={() => props.handleBtnClick()}
    >
      <svg className="menu-btn__icon">
        <use
          href={`${icons}#${props.isMenuOpen ? "close" : "hamburger-menu"}`}
        />
      </svg>
    </button>
  );
}

*/
