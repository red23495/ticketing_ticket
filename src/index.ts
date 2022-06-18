import config from "../config";
import mongoose from "mongoose";
import app from "./app";

const start = async () => {
  await mongoose.connect(`mongodb://${config.dbHost}:${config.dbPort}/${config.dbName}`);
  app.listen(config.port, () => {
    console.log(`auth server starting on port ${config.port}`);
  });
};

start();
