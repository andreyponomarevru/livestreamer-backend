import amqpClient, { type Connection, type Channel } from "amqplib";
import { logger } from "../logger";
import { AMQP_SERVER_CONFIG } from "./config";

type RabbitMQMessage = {
  queue: string;
  exchange: string;
  routingKey: string;
  content: Buffer;
};

let connection: Connection | null = null;

function handleError(err: Error) {
  if (err.message !== "Connection closing") {
    logger.error("AMQP connection error " + err.message);
    connection = null;
  }
}

function handleCloseConnection() {
  logger.error("AMQP connection closed");
  connection = null;
}

async function connectToRabbitMQ() {
  if (connection) {
    logger.debug("Publisher is reusing the existing connection to RabbitMQ");
  } else {
    connection = await amqpClient.connect(AMQP_SERVER_CONFIG);
    connection.on("error", handleError);
    connection.on("close", handleCloseConnection);

    logger.debug("Publisher opened a new connection to RabbitMQ");
  }

  return connection;
}

export async function close() {
  if (connection) {
    await connection.close();
    connection = null;
  }
}

let pubChannel: Channel | null = null;

export async function sendMsgToQueue(msg: RabbitMQMessage) {
  try {
    pubChannel = await (await connectToRabbitMQ()).createChannel();
    await pubChannel.assertExchange(msg.exchange, "direct", { durable: true });
    await pubChannel.assertQueue(msg.queue, { durable: true });
    await pubChannel.bindQueue(msg.queue, msg.exchange, msg.routingKey);
    pubChannel.publish(msg.exchange, msg.routingKey, msg.content, {
      persistent: true,
    });

    await pubChannel.close();

    logger.info("Message sent" + new Date().getSeconds());
  } catch (err) {
    logger.error("Error during message publishing" + err);
  }
}
