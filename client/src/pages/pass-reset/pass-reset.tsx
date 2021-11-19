import React, { ReactElement } from "react";

import { Page } from "../../lib/page/page";
import { PassResetBox } from "../auth-page/pass-reset-box/pass-reset-box";

function PassResetPage(): ReactElement {
  return (
    <Page className="page_box">
      <PassResetBox />
    </Page>
  );
}

export { PassResetPage };
