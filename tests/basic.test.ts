import { expect, test, describe, beforeAll } from "vitest";
import sql, { Database } from "@leafac/sqlite";
import {
  getEnvironmentVariables,
  getPlaidLinkToken,
  getStripeClientAccountCountry,
  sendPostmarkEmail,
} from "../src";

test("Math.sqrt()", () => {
  expect(Math.sqrt(4)).toBe(2);
  expect(Math.sqrt(144)).toBe(12);
  expect(Math.sqrt(2)).toBe(Math.SQRT2);
  expect(Math.sqrt(1)).toBe(1);
});

test("Environment Variables", () => {
  expect(process.env.STRIPE_PRIVATE_KEY).toBeDefined();
  expect(process.env.PLAID_CLIENT_ID).toBeDefined();
  expect(process.env.PLAID_SECRET).toBeDefined();
  expect(process.env.POSTMARK_API).toBeDefined();
  getEnvironmentVariables();
});

test("Plaid Link Token", async () => {
  const linkToken = await getPlaidLinkToken();
  console.log(`Link Token: ${linkToken}`);
  expect(linkToken).toBeDefined();
});

test("Stripe", async () => {
  const stripeCountry = await getStripeClientAccountCountry();
  expect(stripeCountry).toBeDefined();
});

test("Postmark", async () => {
  // const messageId = await sendPostmarkEmail();
  // console.log(messageId);
  // expect(messageId).toBeDefined();
});

describe("Servicing Database", () => {
  let database: Database;

  beforeAll(() => {
    database = new Database(":memory:");
    database.execute(
      sql`CREATE TABLE "users" ("id" INTEGER PRIMARY KEY AUTOINCREMENT, "name" TEXT);`
    );

    database.run(
      sql`INSERT INTO "users" ("name") VALUES (${"Leandro Facchinetti"})`
    );
  });

  test("SELECT", () => {
    expect(
      database.get<{ name: string }>(sql`SELECT name from "users"`)
    ).toEqual({ name: "Leandro Facchinetti" });
  });
});
