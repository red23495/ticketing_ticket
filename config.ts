interface Config {
  port: number;
  httpsEnabled: boolean;
  jwtKey: string;
  dbHost: string;
  dbPort: Number;
  dbName: string;
  natsClusterId: string;
  natsClientId: string;
  natsUrl: string;
}

const config: Config = {
  port: Number.parseInt(process.env.TICKETING_TICKET_PORT ?? "3000"),
  httpsEnabled: !!Number.parseInt(
    process.env.TICKETING_TICKET_HTTPS_ENABLED ?? "0"
  ),
  jwtKey: process.env.TICKETING_TICKET_JWT_KEY ?? "dummy-secret",
  dbHost: process.env.TICKETING_TICKET_DB_HOST ?? "localhost",
  dbPort: Number.parseInt(process.env.TICKETING_TICKET_DB_PORT ?? "27017"),
  dbName: process.env.TICKETING_TICKET_DB_NAME ?? "ticket",
  natsClusterId: process.env.TICKETING_NATS_CLUSTER_ID ?? "ticketing",
  natsClientId: process.env.TICKETING_TICKET_NATS_CLIENT_ID ?? "some-unique-id",
  natsUrl: process.env.TICKETING_NATS_URL ?? "http://localhost:4222",
};

export default config;
