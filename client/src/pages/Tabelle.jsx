import React, { useState } from 'react';
import { Table } from 'react-bootstrap';
import Accordion from 'react-bootstrap/Accordion';
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

const Tabelle = () => {
  const numRows = 21;
  const numCols = 4;

  const [consiglioData, setConsiglioData] = useState(() => {
    const initialData = Array.from({ length: 10 }, () =>
      Array.from({ length: 4 }, () => '')
    );
    return initialData;
  });

  const [storiaClasseData, setStoriaClasseData] = useState(() => {
    const initialData = Array.from({ length: 3 }, () =>
      Array.from({ length: 5 }, () => '')
    );
    return initialData;
  });

  const [docentiData, setDocentiData] = useState(() => {
    const initialData = Array.from({ length: numRows }, () =>
      Array.from({ length: numCols }, () => '')
    );
    return initialData;
  });

  const [progettiData, setProgettiData] = useState(() => {
    const initialData = Array.from({ length: 9 }, () =>
      Array.from({ length: 4 }, () => '')
    );
    return initialData;
  });

  const handleConsiglioCellChange = (e, rowIndex, colIndex) => {
    const newData = [...consiglioData];
    newData[rowIndex][colIndex] = e.target.value;
    setConsiglioData(newData);
  };

  const handleStoriaClasseCellChange = (e, rowIndex, colIndex) => {
    const newData = [...storiaClasseData];
    newData[rowIndex][colIndex] = e.target.value;
    setStoriaClasseData(newData);
  };

  const handleDocentiCellChange = (e, rowIndex, colIndex) => {
    const newData = [...docentiData];
    newData[rowIndex][colIndex] = e.target.value;
    setDocentiData(newData);
  };

  const handleProgettiCellChange = (e, rowIndex, colIndex) => {
    const newData = [...progettiData];
    newData[rowIndex][colIndex] = e.target.value;
    setProgettiData(newData);
  };

  const tableHeaders = [
    'Disciplina del piano di studi',
    'Ore svolte',
    'Docente',
    'Firma di approvazione',
  ];

  const saveData = (filename, tableData) => {
    const tableContent = tableData.map((row) => row.join('\t')).join('\n');
    socket.emit('save_table', { filename, message: tableContent });
  };

  return (
    <div>
      <div className="title">Tabelle</div>
      <div className="container-fluid">
        <div className="row">
          <div className="col">
            <Accordion defaultActiveKey="0">
              <Accordion.Item eventKey="0">
                <Accordion.Header>
                  <strong>Quadro orario</strong>
                </Accordion.Header>
                <Accordion.Body>tab1</Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="1">
                <Accordion.Header>
                  <strong>Composizione del Consiglio di Classe</strong>
                </Accordion.Header>
                <Accordion.Body>
                  <Table striped bordered>
                    <thead>
                      <tr>
                        {tableHeaders.map((header, index) => (
                          <th key={index}>{header}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {consiglioData.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          {row.map((cell, colIndex) => (
                            <td key={colIndex}>
                              <div className="cell-text">
                                <textarea
                                  value={cell}
                                  onChange={(e) =>
                                    handleConsiglioCellChange(
                                      e,
                                      rowIndex,
                                      colIndex
                                    )
                                  }
                                />
                              </div>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  <button
                    type="submit"
                    onClick={() =>
                      saveData('tabella_consiglio.txt', consiglioData)
                    }
                    className="btn btn-success"
                  >
                    Salva dati
                  </button>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="2">
                <Accordion.Header>
                  <strong>
                    Storia della classe e continuità didattica nel triennio
                  </strong>
                </Accordion.Header>
                <Accordion.Body>
                  <Table striped bordered>
                    <thead>
                      <tr>
                        <th>Anno</th>
                        <th>Iscritti</th>
                        <th>Ritirati</th>
                        <th>Promossi</th>
                        <th>Respinti</th>
                      </tr>
                    </thead>
                    <tbody>
                      {storiaClasseData.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          {row.map((cell, colIndex) => (
                            <td key={colIndex}>
                              <div className="cell-text">
                                <textarea
                                  value={cell}
                                  onChange={(e) =>
                                    handleStoriaClasseCellChange(
                                      e,
                                      rowIndex,
                                      colIndex
                                    )
                                  }
                                />
                              </div>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  <button
                    type="submit"
                    onClick={() =>
                      saveData('tabella_storiaclasse.txt', storiaClasseData)
                    }
                    className="btn btn-success"
                  >
                    Salva dati
                  </button>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="3">
                <Accordion.Header>
                  <strong>Continuità dei docenti</strong>
                </Accordion.Header>
                <Accordion.Body>
                  <Table striped bordered>
                    <thead>
                      <tr>
                        <th>Materia</th>
                        <th>Classe</th>
                        <th>A.S.</th>
                        <th>Docente</th>
                      </tr>
                    </thead>
                    <tbody>
                      {docentiData.map((row, rowIndex) => (
                        <React.Fragment key={rowIndex}>
                          {rowIndex > 0 && rowIndex % 3 === 0 && (
                            <tr>
                              <td colSpan="4">-----------------------------</td>
                            </tr>
                          )}
                          <tr>
                            {row.map((cell, colIndex) => (
                              <td key={colIndex}>
                                <div className="cell-text">
                                  <textarea
                                    value={cell}
                                    onChange={(e) =>
                                      handleDocentiCellChange(
                                        e,
                                        rowIndex,
                                        colIndex
                                      )
                                    }
                                  />
                                </div>
                              </td>
                            ))}
                          </tr>
                        </React.Fragment>
                      ))}
                    </tbody>
                  </Table>
                  <button
                    type="submit"
                    onClick={() =>
                      saveData('tabella_docenti.txt', docentiData)
                    }
                    className="btn btn-success"
                  >
                    Salva dati
                  </button>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="4">
                <Accordion.Header>
                  <strong>Progetti PCTO</strong>
                </Accordion.Header>
                <Accordion.Body>
                  <Table striped bordered>
                    <thead>
                      <tr>
                        <th>Cognome</th>
                        <th>Nome</th>
                        <th>Titolo progetto</th>
                        <th>Descrizione, discipline e contenuti</th>
                      </tr>
                    </thead>
                    <tbody>
                      {progettiData.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          {row.map((cell, colIndex) => (
                            <td key={colIndex}>
                              <div className="cell-text">
                                <textarea
                                  value={cell}
                                  onChange={(e) =>
                                    handleProgettiCellChange(
                                      e,
                                      rowIndex,
                                      colIndex
                                    )
                                  }
                                />
                              </div>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  <button
                    type="submit"
                    onClick={() =>
                      saveData('tabella_progetti.txt', progettiData)
                    }
                    className="btn btn-success"
                  >
                    Salva dati
                  </button>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tabelle;
