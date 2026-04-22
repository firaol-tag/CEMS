const mysql = require("mysql");
require("dotenv").config();
const connectDb = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});
connectDb.connect((err) => {
  if (err) {
    console.log("there is something happed with database " + "(" + err + ")");
  } else {
    console.log("database is connected");
  }
  
});
module.exports = connectDb;
