import { SendMailOptions } from "nodemailer";

import {
  MAIL_FROM_EMAIL,
  EMAIL_CONFIRMATION_LINK,
  SIGN_IN_LINK,
  SUBMIT_NEW_PASSWORD_LINK,
} from "../../config/env";
import Mail from "nodemailer/lib/mailer";

type MailConfirmationEmail = {
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

function createConfirmationEmail({
  username,
  email,
  userToken,
}: MailConfirmationEmail): Mail.Options {
  const emailConfirmationlink = `${EMAIL_CONFIRMATION_LINK}?token=${userToken}`;

  const options: SendMailOptions = {
    from: MAIL_FROM_EMAIL,
    to: email,
    subject: "Confirm your email",
    html: `<h1>Confirm your email</h1>
        <p>Hi ${username}.</p>
				<p>
					Thanks for registering. Please confirm your email by clicking <a href="${emailConfirmationlink}">here</a>.
        </p>`,
    replyTo: MAIL_FROM_EMAIL,
  };

  return options;
}

function createWelcomeEmail({ username, email }: WelcomeEmail): Mail.Options {
  const signInLink = SIGN_IN_LINK;

  const options: SendMailOptions = {
    from: MAIL_FROM_EMAIL,
    to: email,
    subject: "Email address confirmed",
    html: `<p>Thanks ${username}, email address confirmed. You're now registered and can <a href="${signInLink}"">log into your account.</a></p>`,
    replyTo: MAIL_FROM_EMAIL,
  };

  return options;
}

function createPasswordResetEmail({
  email,
  token,
}: ResetPasswordTokenEMail): Mail.Options {
  // Link to react app, not to API
  const submitNewPasswordLink = `${SUBMIT_NEW_PASSWORD_LINK}?token=${token}`;

  const options: SendMailOptions = {
    from: MAIL_FROM_EMAIL,
    to: email,
    subject: "Reset Password",
    html: `<p>To reset your password, click <a href="${submitNewPasswordLink}">here</a>.</p>`,
    replyTo: MAIL_FROM_EMAIL,
  };

  return options;
}

export {
  createConfirmationEmail,
  createWelcomeEmail,
  createPasswordResetEmail,
};
