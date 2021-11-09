import * as React from "react";

import { Box } from "../../../lib/box/box";
import { PassResetForm } from "../pass-reset-form/pass-reset-form";
import { useNavigate } from "react-router";
import { useAuthN } from "../../../hooks/use-authn";
import { useQuery } from "../../../hooks/use-query";

function PassResetBox() {
  const navigate = useNavigate();
  const auth = useAuthN();
  React.useEffect(() => {
    if (auth.user) navigate("/");
  });

  const query = useQuery();

  return (
    <Box>
      <h1 className="box__header">Password Reset</h1>
      <PassResetForm token={query.get("token")} />
    </Box>
  );
}

export { PassResetBox };
