import mysql from "mysql2/promise";
import "dotenv/config";

// Promise-based connection pool. Every query returns a Promise, which lets
// controllers use async/await instead of nested callbacks.
export const db = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "mydevify_social",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Verify connectivity once on startup with an actionable error message.
export const assertDbConnection = async () => {
  try {
    const connection = await db.getConnection();
    await connection.ping();
    connection.release();
    console.log("✅ Connected to MySQL database successfully");
  } catch (err) {
    console.error("❌ Database connection failed:", err.code, "-", err.message);
    if (err.code === "ECONNREFUSED" || err.code === "ETIMEDOUT") {
      console.error("👉 Is MySQL running and reachable at DB_HOST:DB_PORT? On Windows, prefer 127.0.0.1 over localhost.");
    }
    if (err.code === "ER_ACCESS_DENIED_ERROR") {
      console.error("👉 Check DB_USER / DB_PASSWORD in your .env file.");
    }
    if (err.code === "ER_BAD_DB_ERROR") {
      console.error("👉 Database does not exist. Create it and run the SQL files in /db.");
    }
    throw err;
  }
};
