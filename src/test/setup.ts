import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import app from "../app";
import jwt from "jsonwebtoken";
import config from "../../config";

declare global {
  function get_cookie(): string[];
}

global.get_cookie = () => {
  const token = jwt.sign(
    {
      email: "test@test.com",
      id: "12345678",
    },
    config.jwtKey
  );
  const session = Buffer.from(JSON.stringify({ token })).toString("base64");
  return [`session=${session}`];
};

jest.mock("../nats-client");

let mongo: MongoMemoryServer;

beforeAll(async () => {
  mongo = new MongoMemoryServer();
  await mongo.start();
  const mongoUri = mongo.getUri();
  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongo.stop();
});
