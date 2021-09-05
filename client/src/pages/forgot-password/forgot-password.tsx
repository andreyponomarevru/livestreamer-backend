import React from "react";

import { ForgotPasswordForm } from "../../components/forgot-password-form/forgot-password-form";

import "./forgot-password.scss";

export function ForgotPasswordPage() {
  return (
    <main className="forgot-password-page">
      <h1 className="forgot-password-page__heading">Forgot Password</h1>
      <ForgotPasswordForm />
    </main>
  );
}
