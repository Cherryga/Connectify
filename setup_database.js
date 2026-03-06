const mysql = require('mysql');
const fs = require('fs');
const path = require('path');

function setupDatabase() {
  try {
    // Create connection
    const connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'Dob@1024',
      database: 'mydevify_social'
    });

    console.log('Connected to database successfully!');

    // Read and execute the SQL file
    const sqlFile = path.join(__dirname, 'enhanced_messaging_tables.sql');
    const sqlContent = fs.readFileSync(sqlFile, 'utf8');
    
    // Split SQL content into individual statements
    const statements = sqlContent
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0);

    console.log('Executing database setup...');

    let completed = 0;
    const total = statements.length;

    statements.forEach((statement, index) => {
      if (statement.trim()) {
        connection.query(statement, (error, results) => {
          completed++;
          
          if (error) {
            if (error.code === 'ER_DUP_FIELDNAME' || error.code === 'ER_DUP_KEYNAME') {
              console.log(`⚠ Skipped (already exists): ${statement.substring(0, 50)}...`);
            } else {
              console.error(`✗ Error executing: ${statement.substring(0, 50)}...`);
              console.error('Error:', error.message);
            }
          } else {
            console.log(`✓ Executed: ${statement.substring(0, 50)}...`);
          }

          if (completed === total) {
            console.log('Database setup completed successfully!');
            connection.end();
          }
        });
      } else {
        completed++;
        if (completed === total) {
          console.log('Database setup completed successfully!');
          connection.end();
        }
      }
    });

  } catch (error) {
    console.error('Database setup failed:', error.message);
    process.exit(1);
  }
}

setupDatabase();
