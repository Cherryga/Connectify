import mysql from "mysql";
import bcrypt from "bcryptjs";

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Dob@1024",
  database: "mydevify_social"
});

// Test database connection and create a test user
db.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Successfully connected to database!');
  
  // Check if test user exists
  const checkUserQuery = "SELECT * FROM users WHERE username = 'testuser'";
  db.query(checkUserQuery, (err, results) => {
    if (err) {
      console.error('Error checking user:', err);
      return;
    }
    
    if (results.length > 0) {
      console.log('Test user already exists!');
      console.log('Username: testuser');
      console.log('Password: testpass123');
      db.end();
      return;
    }
    
    // Create test user
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync('testpass123', salt);
    
    const createUserQuery = `
      INSERT INTO users (username, email, password, name, profilePic) 
      VALUES (?, ?, ?, ?, ?)
    `;
    
    const values = [
      'testuser',
      'test@example.com',
      hashedPassword,
      'Test User',
      null
    ];
    
    db.query(createUserQuery, values, (err, result) => {
      if (err) {
        console.error('Error creating user:', err);
        return;
      }
      
      console.log('Test user created successfully!');
      console.log('Username: testuser');
      console.log('Password: testpass123');
      console.log('You can now login with these credentials');
      
      // Create some sample posts
      const samplePosts = [
        {
          desc: "Welcome to SocialPulse! This is my first post. 🎉",
          img: "",
          userid: result.insertId,
          createdAt: new Date()
        },
        {
          desc: "Beautiful day for sharing moments with friends! ☀️",
          img: "",
          userid: result.insertId,
          createdAt: new Date()
        }
      ];
      
      const insertPostQuery = "INSERT INTO posts (desc, img, userid, createdAt) VALUES (?, ?, ?, ?)";
      
      samplePosts.forEach((post, index) => {
        db.query(insertPostQuery, [post.desc, post.img, post.userid, post.createdAt], (err) => {
          if (err) {
            console.error('Error creating post:', err);
          } else {
            console.log(`Sample post ${index + 1} created`);
          }
          
          if (index === samplePosts.length - 1) {
            db.end();
            console.log('Setup complete! You can now login and see posts.');
          }
        });
      });
    });
  });
}); 