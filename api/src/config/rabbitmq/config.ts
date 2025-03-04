import amqpClient from "amqplib";
import {
  RABBITMQ_PROTOCOL,
  RABBITMQ_HOSTNAME,
  RABBITMQ_PORT,
  RABBITMQ_USER,
  RABBITMQ_PASSWORD,
  RABBITMQ_HEARTBEAT,
  RABBITMQ_VHOST,
} from "../env";

export const EXCHANGE_NAME = "livestreamer";
export const QUEUES = {
  confirmSignUpEmail: {
    queue: `${EXCHANGE_NAME}.send_confirm_sign_up_email`,
    routingKey: "send_confirm_sign_up_email",
  },
  welcomeEmail: {
    queue: `${EXCHANGE_NAME}.send_sign_up_success_email`,
    routingKey: "send_sign_up_success_email",
  },
  resetPasswordEmail: {
    queue: `${EXCHANGE_NAME}.send_password_reset_email`,
    routingKey: "send_password_reset_email",
  },
};

export const AMQP_SERVER_CONFIG: amqpClient.Options.Connect = {
  protocol: RABBITMQ_PROTOCOL,
  hostname: RABBITMQ_HOSTNAME,
  port: RABBITMQ_PORT,
  username: RABBITMQ_USER,
  password: RABBITMQ_PASSWORD,
  heartbeat: RABBITMQ_HEARTBEAT,
  vhost: RABBITMQ_VHOST,
};
