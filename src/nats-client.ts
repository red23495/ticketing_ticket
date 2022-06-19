import nats, { Stan } from "node-nats-streaming";

export class NatsClient {

  private _client?: Stan;

  get client() {
    if (!this._client) throw Error("Cannot access nats client before connect");
    return this._client;
  }

  connect(clusterId: string, clientId: string, url: string) {
    this._client = nats.connect(clusterId, clientId, { url });
    return new Promise<void>((resolve, reject) => {
      this.client.on("connect", () => {
        resolve();
      });
      this.client.on("error", (err) => {
        reject(err);
      });
    });
  }
}

export const natsClient = new NatsClient(); 