import http from "http";
import { expressApp } from "./express-app";
import {
  onServerListening,
  onServerError,
  onServerUpgrade,
} from "./http-server-event-handlers";
import { rabbitMQConsumer } from "./config/rabbitmq/consumer";

const httpServer = http.createServer(expressApp);
httpServer.on("error", onServerError);
httpServer.on("listening", onServerListening);
httpServer.on("upgrade", onServerUpgrade);

rabbitMQConsumer.connection.open().catch(console.error);

export { httpServer };
