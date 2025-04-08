import { describe, it, afterAll, expect } from "vitest";
import "dotenv/config";
import pool from "./connection.js";

describe("Database connection integration", () => {
  it("should connect to the database successfully", async () => {
    const [result] = await pool.query("SELECT 1 as value");

    expect(result[0].value).toBe(1);
  });

  it("should have the required database tables", async () => {
    const [tables] = await pool.query(
      `
      SELECT table_name
      FROM information_schema.tables
      WHERE table_type='BASE TABLE'
        AND table_schema = ?
      `,
      [process.env.MYSQL_DATABASE || "tmu"],
    );

    const tableNames = tables.map((table) => table.TABLE_NAME);
    const expectedTables = [
      "actividad",
      "admin",
      "asignatura",
      "curso",
      "docente",
      "entrada_tablon_anuncios",
      "entrega",
      "estudiante",
      "estudiante_asignatura",
      "horario",
      "mensaje",
      "padre",
      "rol",
      "usuario",
    ];

    for (const expectedTableName of expectedTables) {
      expect(tableNames).toContain(expectedTableName);
    }
  });

  afterAll(async () => {
    await pool.end();
  });
});
