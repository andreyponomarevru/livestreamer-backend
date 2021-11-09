import * as React from "react";
import { Link } from "react-router-dom";

import { useLocation } from "react-router";
import { Box } from "../../../lib/box/box";
import { SignInForm } from "../signin-form/signin-form";
import { SignUpForm } from "../signup-form/signup-form";

function AuthBox(props: any) {
  const location = useLocation();

  const activeSignInClassName =
    location.pathname === "/signin" ? "box__header-link_active" : "";

  const activeSignUpClassName =
    location.pathname === "/register" ? "box__header-link_active" : "";

  return (
    <Box className={`auth-box ${props.className || ""}`}>
      <header className="box__header">
        <Link
          to="/signin"
          className={`box__header-link ${activeSignInClassName}`}
        >
          Log In
        </Link>
        <Link
          to="/register"
          className={`box__header-link ${activeSignUpClassName}`}
        >
          Sign Up
        </Link>
      </header>
      {location.pathname === "/signin" ? <SignInForm /> : <SignUpForm />}
    </Box>
  );
}

export { AuthBox };
