import mysql from "mysql2";

export const db = mysql.createConnection({
  host: "localhost",
  user: "root", // replace with your MySQL username
  password: "1234", // replace with your MySQL password
  database: "social",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL database");
});
