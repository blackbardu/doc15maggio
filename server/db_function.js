const express = require('express');
const db = require('./db');

const app = express();

app.get('/users', async (req, res) => {
  try {
    const teachers = await db('SELECT nome_utente FROM Insegnante');
    console.log(teachers); 
    res.json(teachers);
  } catch (error) {
    console.error(error); 
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.get('/passwords', async (req, res) => {
    try {
      const password = await db('SELECT password FROM Insegnante');
      console.log(password); 
      res.json(password);
    } catch (error) {
      console.error(error); 
      res.status(500).json({ error: 'An error occurred' });
    }
  });

app.listen(3005, () => {
  console.log('Server started on port 3005');
});

