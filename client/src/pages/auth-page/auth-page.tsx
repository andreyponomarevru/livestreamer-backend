import React, { Fragment, ReactElement } from "react";
import { Link, useLocation } from "react-router-dom";

import { SignInForm } from "../../components/signin-form/signin-form";
import { SignUpForm } from "../../components/signup-form/signup-form";

import "./auth-page.scss";

export function PagesAuth(): ReactElement {
  const location = useLocation();

  return (
    <div className="auth-page">
      <header className="auth-page__header">
        <Link
          to="/signin"
          className={`auth-page__header-link ${
            location.pathname === "/signin"
              ? "auth-page__header-link_active"
              : ""
          }`}
        >
          Sign In
        </Link>
        <Link
          to="/signup"
          className={`auth-page__header-link ${
            location.pathname === "/signup"
              ? "auth-page__header-link_active"
              : ""
          }`}
        >
          Sign Up
        </Link>
      </header>
      {location.pathname === "/signin" ? <SignInForm /> : <SignUpForm />}
    </div>
  );
}
