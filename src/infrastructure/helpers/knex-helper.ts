import knex, { Knex } from "knex";
import * as pg from "pg";

pg.types.setTypeParser(20, "text", (value) => parseInt(value, 10));

export class KnexHelper {
  private client: Knex | null = null;
  private connected = false;

  private constructor() {}

  connect(url: string): void {
    if (this.client !== null) throw new Error("Knex already connected");
    this.client = knex({ client: "pg", connection: url });
    this.connected = true;
  }

  async disconnect(): Promise<void> {
    if (this.client === null) throw new Error("Knex not connected");
    await this.client.destroy();
    this.connected = false;
  }

  getClient(): Knex {
    if (this.client === null) throw new Error("Knex not connected");
    return this.client;
  }

  isConnected(): boolean {
    return this.connected;
  }

  private static instance: KnexHelper | null = null;

  static getInstance(): KnexHelper {
    if (KnexHelper.instance === null) KnexHelper.instance = new KnexHelper();
    return KnexHelper.instance;
  }
}
