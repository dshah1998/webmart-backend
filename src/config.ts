import {
  cleanEnv,
  str,
  port,
  url,
  host,
  num,
  CleanedEnvAccessors,
  email,
} from "envalid";
import dotenv from "dotenv";

dotenv.config();

/**
 * Envalid is a small library for validating and accessing environment variables in Node.js.
 * https://www.npmjs.com/package/envalid
 * https://www.npmjs.com/package/dotenv
 */

/**
 * Type of env variables of the project
 */
type Environment = {
  NODE_ENV: string;
  PORT: number;
  SERVER_URL: string;
  SECRET_HEX: string;
  ACCESS_TOKEN_LIFETIME_MIN: number;
  REFRESH_TOKEN_LIFETIME_MIN: number;
  FRONTEND_BASE_URL: string;
  FRONTEND_CHANGE_PASSWORD_URL: string;
  FRONTEND_VERIFY_EMAIL_URL: string;
  POSTGRES_CONNECTION: string;
  POSTGRES_HOST: string;
  POSTGRES_USER: string;
  POSTGRES_PASSWORD: string;
  POSTGRES_DB: string;
  POSTGRES_PORT: number;
  GMAIL_USER: string;
  ADMIN_CONTACT_EMAIL: string;
  GMAIL_CLIENT_ID: string;
  GMAIL_CLIENT_SECRET: string;
  GMAIL_REFRESH_TOKEN: string;
  GMAIL_PASSWORD: string;
  STRIPE_PUBLISHABLE_KEY: string;
  STRIPE_SECRET_KEY: string;
};

export type Env = Readonly<Environment & CleanedEnvAccessors>;

const env: Env = cleanEnv<Environment>(process.env, {
  NODE_ENV: str({
    choices: ["production", "test", "development"],
    default: "production",
  }),
  PORT: port({ default: 3333 }),
  SERVER_URL: url(),
  SECRET_HEX: str(),
  ACCESS_TOKEN_LIFETIME_MIN: num(),
  REFRESH_TOKEN_LIFETIME_MIN: num(),
  FRONTEND_BASE_URL: str(),
  FRONTEND_CHANGE_PASSWORD_URL: str(),
  FRONTEND_VERIFY_EMAIL_URL: str(),
  POSTGRES_CONNECTION: str({
    default: "postgres",
    choices: ["postgres"],
  }),
  POSTGRES_HOST: host({ default: "localhost" }),
  POSTGRES_USER: str(),
  POSTGRES_PASSWORD: str(),
  POSTGRES_DB: str({ default: "webmart" }),
  POSTGRES_PORT: port({ default: 5432 }),
  GMAIL_USER: email(),
  ADMIN_CONTACT_EMAIL: email(),
  GMAIL_PASSWORD: str(),
  GMAIL_CLIENT_ID: str({ default: undefined }),
  GMAIL_CLIENT_SECRET: str({ default: undefined }),
  GMAIL_REFRESH_TOKEN: str({ default: undefined }),
  STRIPE_PUBLISHABLE_KEY: str(),
  STRIPE_SECRET_KEY: str(),
});

export default env;
