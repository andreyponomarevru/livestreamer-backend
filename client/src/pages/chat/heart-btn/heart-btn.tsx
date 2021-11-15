import * as React from "react";

import { useAuthN } from "../../../hooks/use-authn";
import { useIsMounted } from "../../../hooks/use-is-mounted";
import { LIKE_TIMEOUT_MS } from "../../../config/env";
import { useStreamLikeButton } from "../../../hooks/use-stream-like-button";

import icons from "./../../../icons.svg";
import "./heart-btn.scss";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  isStreamOnline: boolean;
}

export function HeartBtn(props: Props): React.ReactElement {
  const isMounted = useIsMounted();
  const auth = useAuthN();
  const { handleBtnClick, setIsEnabled, isEnabled } = useStreamLikeButton();

  React.useEffect(() => {
    if (isMounted && props.isStreamOnline) setIsEnabled(true);
    else if (isMounted && !props.isStreamOnline) setIsEnabled(false);
  }, [props.isStreamOnline, isMounted, auth.user]);

  React.useEffect(() => {
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
      className={`heart-btn ${
        isEnabled && props.isStreamOnline ? "" : "heart-btn_disabled"
      } ${props.className || ""}`}
      onClick={isEnabled && props.isStreamOnline ? handleBtnClick : undefined}
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
