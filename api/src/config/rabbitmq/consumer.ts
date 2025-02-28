import amqpClient, {
  type Connection,
  type Channel,
  type ConsumeMessage,
} from "amqplib";
import { logger } from "../logger";
import { AMQP_SERVER_CONFIG } from "./config";

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
    logger.debug("Consumer is reusing the existing connection to RabbitMQ");
  } else {
    connection = await amqpClient.connect(AMQP_SERVER_CONFIG);
    connection.on("error", handleError);
    connection.on("close", handleCloseConnection);

    logger.debug("Consumer opened a new connection to RabbitMQ");
  }

  return connection;
}

let channel: Channel;

export async function consumerMsgFromQueue<T>(
  queueName: string,
  processMsg: (msg: ConsumeMessage | null) => Promise<T>,
) {
  channel = await (await connectToRabbitMQ()).createChannel();
  await channel.prefetch(10);
  await channel.assertQueue(queueName, { durable: true });
  await channel.consume(
    queueName,
    async function (msg) {
      try {
        if (msg) {
          await processMsg(msg);
          channel.ack(msg);
        } else {
          logger.warning("Empty message. Not acking");
        }
      } catch (err) {
        logger.error("Error while consuming the message " + err);
      }
    },
    {
      noAck: false,
      consumerTag: "mail-service_consumer",
    },
  );

  logger.debug("Waiting for messages ...");
}
