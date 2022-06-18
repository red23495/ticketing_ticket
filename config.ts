interface Config {
  port: number;
  httpsEnabled: boolean;
  jwtKey: string;
  dbHost: string;
  dbPort: Number;
  dbName: string;
}

const config: Config = {
  port: Number.parseInt(process.env.TICKETING_AUTH_PORT ?? "3000"),
  httpsEnabled: !!Number.parseInt(
    process.env.TICKETING_AUTH_HTTPS_ENABLED ?? "0"
  ),
  jwtKey: process.env.TICKETING_AUTH_JWT_KEY ?? "dummy-secret",
  dbHost: process.env.TICKETING_AUTH_DB_HOST ?? "localhost",
  dbPort: Number.parseInt(process.env.TICKETING_AUTH_DB_PORT ?? "27017"),
  dbName: process.env.TICKETING_AUTH_DB_NAME ?? "ticket",
};

export default config;
