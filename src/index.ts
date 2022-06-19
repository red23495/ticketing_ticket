import config from "../config";
import mongoose from "mongoose";
import app from "./app";
import { natsClient } from "./nats-client";

const start = async () => {
  await natsClient.connect(config.natsClusterId, config.natsClientId, config.natsUrl);
  natsClient.client.on("close", () => {
    process.exit();
  });
  process.on('SIGINT', () => natsClient.client.close());
  process.on('SIGTERM', () => natsClient.client.close());
  await mongoose.connect(`mongodb://${config.dbHost}:${config.dbPort}/${config.dbName}`);
  app.listen(config.port, () => {
    console.log(`auth server starting on port ${config.port}`);
  });
};

start();
