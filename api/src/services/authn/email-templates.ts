import { SendMailOptions } from "nodemailer";

import { MAIL_FROM_EMAIL } from "../../config/env";

type EmailConfirmationEmail = {
  username: string;
  email: string;
  userId: number;
  userToken: string;
};

type WelcomeEmail = {
  username: string;
  email: string;
};

type ResetPasswordTokenEMail = {
  email: string;
  token: string;
};

export function createConfirmationEmail({
  username,
  email,
  userToken,
}: EmailConfirmationEmail) {
  const emailConfirmationlink = `http://localhost:5000/api/v1/verification?token=${userToken}`;

  const options: SendMailOptions = {
    from: MAIL_FROM_EMAIL,
    to: email,
    subject: "Confirm your email",
    html: `<h1>Email Confirmation</h1>
        <p>Hi ${username}.</p>
				<p>
					Thank you for subscribing. Please confirm your email by clicking <a href="${emailConfirmationlink}">here</a>.
        </p>`,
    replyTo: MAIL_FROM_EMAIL,
  };

  return options;
}

export function createWelcomeEmail({ username, email }: WelcomeEmail) {
  const signInLink = "http://www.andreyponomarev.ru";

  const options: SendMailOptions = {
    from: MAIL_FROM_EMAIL,
    to: email,
    subject: "Email address confirmed",
    html: `<p>Thanks ${username}, email address confirmed. You're now signed up and can <a href="${signInLink}"">log into your account.</a></p>`,
    replyTo: MAIL_FROM_EMAIL,
  };

  return options;
}

export function createResetPasswordEmail({
  email,
  token,
}: ResetPasswordTokenEMail) {
  const resetPasswordLink = `http://localhost:5000/password-reset?token=${token}`;

  const options: SendMailOptions = {
    from: MAIL_FROM_EMAIL,
    to: email,
    subject: "Reset Password",
    html: `<p>To reset your password, click <a href="${resetPasswordLink}">here</a>.</p>`,
    replyTo: MAIL_FROM_EMAIL,
  };

  return options;
}
