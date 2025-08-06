import mysql from "mysql";

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Dob@1024",
  database: "mydevify_social"
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