const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 3005;

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'rirdocca',
  database: 'documento',
});

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});


app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  const query = 'SELECT * FROM Insegnante WHERE nome_utente = ? AND password = ?';
  const params = [username, password];

  pool.query(query, params, (error, results) => {
    if (error) {
      console.error('Error during login:', error);
      res.status(500).json({ success: false, error: 'An error occurred during login.' });
    } else {
      if (results.length > 0) {
        // Username and password are correct
        const loggedInUsername = results[0].nome_utente;
        res.json({ success: true, loggedInUsername });
      } else {
        // Invalid username or password
        res.json({ success: false, error: 'Invalid username or password.' });
      }
    }
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
