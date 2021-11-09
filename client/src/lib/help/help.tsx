import * as React from "react";

import "../link/link.scss";
import "./help.scss";

function Help() {
  return (
    <p className="help">
      Need help?{" "}
      <a href="mailto:info@andreyponomarev.ru" className="link">
        Contact us
      </a>
    </p>
  );
}

export { Help };
