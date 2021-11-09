import React, { ReactElement } from "react";
import { Page } from "../../lib/page/page";
import { AuthBox } from "./auth-box/auth-box";

export function PagesAuth(): ReactElement {
  return (
    <Page className="page_box">
      <AuthBox />
    </Page>
  );
}
