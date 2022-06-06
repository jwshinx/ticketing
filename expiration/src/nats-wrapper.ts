import nats, { Stan } from 'node-nats-streaming';

class NatsWrapper {
  private _client?: Stan;

  get client() {
    if (!this._client) {
      throw new Error('>>> cannot access nats client before connecting');
    }
    return this._client
  }

  connect(clusterId: string, clientId: string, url: string) {
    this._client = nats.connect(clusterId, clientId, { url });

    // use promise so connect can be used with async/await syntax
    // add void, to fix resolve() error
    // return new Promise((resolve, reject) => {
    return new Promise<void>((resolve, reject) => {
      this.client.on('connect', () => {
        console.log('>>> connected to nats!!!');
        resolve();
      });
      this.client.on('error', (err) => {
        console.log('nats connection error!!!');
        reject(err);
      });      
    });

  }
}

// singleton
export const natsWrapper = new NatsWrapper();
