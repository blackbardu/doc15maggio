CREATE TABLE Insegnante (
	id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(50) NOT NULL,
  cognome VARCHAR(50) NOT NULL,
  nome_utente VARCHAR(50) NOT NULL,
  password VARCHAR(50) NOT NULL
);

CREATE TABLE Materia_Insegnata (
  id INT AUTO_INCREMENT,
  id_insegnante INT,    
  PRIMARY KEY(id, id_insegnante),
  foreign key (id_insegnante) REFERENCES Insegnante(id),
  materia VARCHAR(100) NOT NULL
);

CREATE TABLE Coordinatore (
	id_coordinatore INT PRIMARY KEY,
  foreign key (id_coordinatore) REFERENCES Insegnante(id)
);

INSERT INTO Insegnante (nome, cognome, nome_utente, password) VALUES ('paola', 'gasperoni', 'paola.gasperoni', 'password');
INSERT INTO Insegnante (nome, cognome, nome_utente, password) VALUES ('laura', 'vendraminetto', 'laura.vendraminetto', 'password');
INSERT INTO Insegnante (nome, cognome, nome_utente, password) VALUES ('emanuele', 'parini', 'emanuele.parini', 'password');
INSERT INTO Insegnante (nome, cognome, nome_utente, password) VALUES ('david', 'veneti', 'david.veneti', 'password');
INSERT INTO Insegnante (nome, cognome, nome_utente, password) VALUES ('lorenzo', 'melagranati', 'lorenzo.melagranati', 'password');
INSERT INTO Insegnante (nome, cognome, nome_utente, password) VALUES ('barbara', 'baronio', 'barbara.baronio', 'password');
INSERT INTO Insegnante (nome, cognome, nome_utente, password) VALUES ('ilaria', 'ciccarelli', 'ilaria.ciccarelli', 'password');
INSERT INTO Insegnante (nome, cognome, nome_utente, password) VALUES ('francesco', 'tappi', 'francesco.tappi', 'password');

INSERT INTO Materia_Insegnata (id_insegnante, materia) VALUES (1, 'italiano');
INSERT INTO Materia_Insegnata (id_insegnante, materia) VALUES (1, 'storia');
INSERT INTO Materia_Insegnata (id_insegnante, materia) VALUES (2, 'inglese');
INSERT INTO Materia_Insegnata (id_insegnante, materia) VALUES (3, 'matematica');
INSERT INTO Materia_Insegnata (id_insegnante, materia) VALUES (4, 'sistemi');
INSERT INTO Materia_Insegnata (id_insegnante, materia) VALUES (5, 'tpsit');
INSERT INTO Materia_Insegnata (id_insegnante, materia) VALUES (5, 'gpoi');
INSERT INTO Materia_Insegnata (id_insegnante, materia) VALUES (6, 'religione');
INSERT INTO Materia_Insegnata (id_insegnante, materia) VALUES (7, 'ginnastica');
INSERT INTO Materia_Insegnata (id_insegnante, materia) VALUES (8, 'informatica');

INSERT INTO Coordinatore (id_coordinatore) VALUES (1);

