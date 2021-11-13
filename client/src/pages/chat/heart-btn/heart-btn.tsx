import React, { ReactElement, useState, useContext, useEffect } from "react";

import { API_ROOT_URL } from "../../../config/env";
import { parseResponse } from "../../../utils/parse-response";
import { useAuthN } from "../../../hooks/use-authn";
import { useNavigate } from "react-router-dom";
import { useIsMounted } from "../../../hooks/use-is-mounted";
import { LIKE_TIMEOUT_MS } from "../../../config/env";

import icons from "./../../../icons.svg";
import "./heart-btn.scss";
import { ROUTES } from "../../../config/routes";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  isStreamOnline: boolean;
}

export function HeartBtn(props: Props): ReactElement {
  function handleBtnClick() {
    if (!user) {
      console.log(
        "[heartBtn] To like the stream, the user has to be authenticated"
      );
      navigate(ROUTES.signIn);
      return;
    } else if (!props.isStreamOnline) {
      console.log("[heartBtn] Stream is offline");
      return;
    }

    const request: RequestInit = { method: "PUT" };
    fetch(`${API_ROOT_URL}/stream/like`, request)
      .then(parseResponse)
      .then(() => {
        setIsEnabled(false);
      })
      .catch((err) => console.log(err));
  }

  const navigate = useNavigate();
  const { user } = useAuthN();
  const [isEnabled, setIsEnabled] = useState(false);

  const isMounted = useIsMounted();

  useEffect(() => {
    if (isMounted && props.isStreamOnline) setIsEnabled(true);
    else if (isMounted && !props.isStreamOnline) setIsEnabled(false);
  }, [props.isStreamOnline, isMounted, user]);

  useEffect(() => {
    let timerId: NodeJS.Timer;
    if (isMounted && !isEnabled && props.isStreamOnline) {
      timerId = setTimeout(() => setIsEnabled(true), LIKE_TIMEOUT_MS);
    }

    return () => {
      clearTimeout(timerId);
      console.log("[HeartBtn] Time cleared on unmounting");
    };
  }, [isEnabled, isMounted]);

  return (
    <button
      disabled={!isEnabled}
      className={`heart-btn ${isEnabled ? "" : "heart-btn_disabled"} ${
        props.className || ""
      }`}
      onClick={isEnabled ? handleBtnClick : undefined}
      type="submit"
      name="heart"
      value=""
    >
      <svg className="heart-btn__icon">
        <use href={`${icons}#heart`} />
        <animate
          begin="click"
          attributeName="fill"
          values="#333333;#aa0500"
          dur="10s"
          repeatCount="1"
          fill="remove"
        />
      </svg>
    </button>
  );
}
