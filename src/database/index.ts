import { createConnection, Connection } from "typeorm";

import postgreTypeormConfig from "../config/postgreTypeorm";

/**
 * Title: Database Connection Service;
 * Created By: Sarang Patel;
 */
export default class Database {
  static #instance: Database;

  #connection?: Connection;

  constructor() {
    if (Database.#instance instanceof Database) {
      return Database.#instance;
    }

    Database.#instance = this;
  }

  get connection(): Connection | undefined {
    return this.#connection;
  }

  /**
   * Method that connects the database to the server.
   */
  async connect(): Promise<Connection> {
    [this.#connection] = await Promise.all([
      createConnection(postgreTypeormConfig),
    ]);
    return this.#connection;
  }

  async disConnect(): Promise<void> {
    if (this.#connection) {
      await this.#connection.close();
    }
  }
}
