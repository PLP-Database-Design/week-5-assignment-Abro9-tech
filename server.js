

// server.js

const express = require('express');
const mysql = require('mysql2');
require('dotenv').config(); // Load environment variables from .env

const app = express();

// MySQL database connection setup
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the database');
});

// 1. Get all patients
app.get('/patients', (req, res) => {
  const sql = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients';
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching patients:', err);
      return res.status(500).send('Error fetching patients');
    }
    res.json(results);
  });
});

// 2. Get all providers
app.get('/providers', (req, res) => {
  const sql = 'SELECT first_name, last_name, provider_specialty FROM providers';
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching providers:', err);
      return res.status(500).send('Error fetching providers');
    }
    res.json(results);
  });
});

// 3. Filter patients by first name
app.get('/patients/:first_name', (req, res) => {
  const { first_name } = req.params;
  const sql = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?';
  connection.query(sql, [first_name], (err, results) => {
    if (err) {
      console.error('Error fetching patients:', err);
      return res.status(500).send('Error fetching patients');
    }
    res.json(results);
  });
});

// 4. Retrieve providers by specialty
app.get('/providers/specialty/:specialty', (req, res) => {
  const { specialty } = req.params;
  const sql = 'SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?';
  connection.query(sql, [specialty], (err, results) => {
    if (err) {
      console.error('Error fetching providers:', err);
      return res.status(500).send('Error fetching providers');
    }
    res.json(results);
  });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
