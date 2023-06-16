const express = require('express');
const mysql = require('mysql');
const app = express();
const jwt = require('jsonwebtoken');
const port = 3005;

const jwtSecretKey = 'RickBardu';

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
        const loggedInUsername = results[0].nome_utente;

        const queryMaterie = 'SELECT materia FROM Materia_Insegnata WHERE id_insegnante = ?';
        const idInsegnante = results[0].id;

        pool.query(queryMaterie, idInsegnante, (errorMaterie, resultsMaterie) => {
          if (errorMaterie) {
            console.error('Error during retrieving subjects:', errorMaterie);
            res.status(500).json({ success: false, error: 'An error occurred during login.' });
          } else {
            const materieInsegnate = resultsMaterie.map((row) => row.materia);

            const queryCoordinatore = 'SELECT * FROM Coordinatore WHERE id_coordinatore = ?';
            pool.query(queryCoordinatore, idInsegnante, (errorCoordinatore, resultsCoordinatore) => {
              if (errorCoordinatore) {
                console.error('Error during retrieving coordinator:', errorCoordinatore);
                res.status(500).json({ success: false, error: 'An error occurred during login.' });
              } else {
                const isCoordinatore = resultsCoordinatore.length > 0;
                const token = jwt.sign({ username: loggedInUsername, id: idInsegnante }, jwtSecretKey, { expiresIn: '1h' });
                res.json({ success: true, token, loggedInUsername, materieInsegnate, isCoordinatore });
                console.log(loggedInUsername, materieInsegnate, isCoordinatore);
              }
            });
          }
        });
      } else {
        res.json({ success: false, error: 'Invalid username or password.' });
      }
    }
  });
});





app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
