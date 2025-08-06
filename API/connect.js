// import mysql from "mysql";

// export const db = mysql.createConnection({
//     host:"localhost",
//     user: "root",
//     password:"Dob@1024",
//     database:"mydevify_social"
// }) 


import mysql from "mysql";

// Use a pool to avoid fatal connection errors


export const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Dob@1024",
  database: "mydevify_social"
});

