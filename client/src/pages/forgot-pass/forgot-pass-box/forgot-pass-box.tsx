import * as React from "react";

import { Box } from "../../../lib/box/box";
import { ForgotPasswordForm } from "../forgot-pass-form/forgot-pass-form";

function ForgotPassBox() {
  return (
    <Box>
      <h1 className="box__header">Forgot Password</h1>
      <ForgotPasswordForm />
    </Box>
  );
}

export { ForgotPassBox };
