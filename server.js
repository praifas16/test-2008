const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// ตั้งค่าการเชื่อมต่อฐานข้อมูล
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'user_info'
});

// เชื่อมต่อฐานข้อมูล
connection.connect(err => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to database');
});

// ตั้งค่า express เพื่อใช้ body-parser
app.use(bodyParser.json());
app.use(express.static('public'));

// รับข้อมูลจากฟอร์มและดึงข้อมูลทั้งหมดจากตาราง
app.post('/submit', (req, res) => {
  const { first_name, age } = req.body;

  const insertSql = 'INSERT INTO user_info (first_name, age) VALUES (?, ?)';
  connection.query(insertSql, [first_name, age], (error, results) => {
    if (error) {
      console.error('Error inserting data:', error.stack);
      res.status(500).json({ success: false });
    } else {
      // ดึงข้อมูลทั้งหมดจากตาราง user_info
      const selectSql = 'SELECT * FROM user_info';
      connection.query(selectSql, (error, results) => {
        if (error) {
          console.error('Error retrieving data:', error.stack);
          res.status(500).json({ success: false });
        } else {
          res.json({ success: true, data: results });
        }
      });
    }
  });
});

// เริ่มเซิร์ฟเวอร์
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
