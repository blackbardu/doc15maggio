CREATE TABLE Insegnanti (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(50) NOT NULL,
  cognome VARCHAR(50) NOT NULL,
  nome_utente VARCHAR(50) NOT NULL,
  password VARCHAR(50) NOT NULL,
  materia_insegnata VARCHAR(50) NOT NULL
);
