// import mysql from "mysql";
// import "dotenv/config";

// // Use a pool to avoid fatal connection errors


// export const db = mysql.createConnection({
//   host: process.env.DB_HOST || "localhost",
//   user: process.env.DB_USER || "root",
//   password: process.env.DB_PASSWORD || "",
//   database: process.env.DB_NAME || "mydevify_social",
//   port: Number(process.env.DB_PORT || 3306),
// });



import mysql from "mysql";
import "dotenv/config";

// Use CONNECTION POOL instead of single connection to prevent fatal errors
export const db = mysql.createPool({
  connectionLimit: 10, // Max number of connections in pool
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "mydevify_social",
  port: Number(process.env.DB_PORT || 3306),
  waitForConnections: true,
  queueLimit: 0
});

// Test the connection on startup
db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Database connection failed:");
    console.error("Error code:", err.code);
    console.error("Error message:", err.message);
    
    if (err.code === 'ECONNREFUSED') {
      console.error('👉 Make sure MySQL server is running!');
    }
    if (err.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('👉 Check your database username/password in .env file');
    }
    if (err.code === 'ER_BAD_DB_ERROR') {
      console.error('👉 Database does not exist. Create it first!');
    }
  } else {
    console.log("✅ Connected to MySQL database successfully");
    connection.release(); // Return connection to pool
  }
});

// Handle pool errors
db.on('error', (err) => {
  console.error('❌ Database pool error:', err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.error('Database connection was closed.');
  } else {
    throw err;
  }
});