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
export const USER_SIGN_UP_QUEUE_NAME = "livestreamer.sign_up_email";
export const USER_SIGN_UP_ROUTING_KEY_NAME = "sign_up_email";

export const AMQP_SERVER_CONFIG: amqpClient.Options.Connect = {
  protocol: RABBITMQ_PROTOCOL,
  hostname: RABBITMQ_HOSTNAME,
  port: RABBITMQ_PORT,
  username: RABBITMQ_USER,
  password: RABBITMQ_PASSWORD,
  heartbeat: RABBITMQ_HEARTBEAT,
  vhost: RABBITMQ_VHOST,
};
