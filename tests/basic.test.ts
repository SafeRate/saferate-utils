import { expect, test, describe, beforeAll } from "vitest";
import sql, { Database } from "@leafac/sqlite";

test("Math.sqrt()", () => {
  expect(Math.sqrt(4)).toBe(2);
  expect(Math.sqrt(144)).toBe(12);
  expect(Math.sqrt(2)).toBe(Math.SQRT2);
  expect(Math.sqrt(1)).toBe(1);
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
