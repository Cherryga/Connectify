import mysql from "mysql2";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", "API", ".env") });

const db = mysql.createConnection({
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "mydevify_social",
});

// Test database connection
db.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Successfully connected to database!');
  
  // Test query to get posts
  db.query('SELECT * FROM posts LIMIT 5', (err, results) => {
    if (err) {
      console.error('Error querying posts:', err);
    } else {
      console.log('Posts found:', results.length);
      console.log('Sample posts:', results);
    }
    
    // Test query to get users
    db.query('SELECT * FROM users LIMIT 5', (err, results) => {
      if (err) {
        console.error('Error querying users:', err);
      } else {
        console.log('Users found:', results.length);
        console.log('Sample users:', results);
      }
      
      // Close connection
      db.end();
    });
  });
}); 