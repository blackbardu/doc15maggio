import React, { useState, useEffect, useRef } from 'react';
import { Table } from 'react-bootstrap';
import Accordion from 'react-bootstrap/Accordion';
import AccordionBody from 'react-bootstrap/esm/AccordionBody';
import AccordionHeader from 'react-bootstrap/esm/AccordionHeader';
import AccordionItem from 'react-bootstrap/esm/AccordionItem';
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

    const [votiData, setVotiData] = useState(() => {
        const initialData = Array.from({ length: 8 }, () =>
          Array.from({ length: 3 }, () => '')
        );
        return initialData;
      });   
  
    const tableHeaders = [
      'Disciplina del piano di studi',
      'Ore svolte',
      'Docente',
      'Firma di approvazione',
    ];   
  
    const addProgettiRow = () => {
      const newRow = Array.from({ length: numCols }, () => '');
      setProgettiData((prevData) => [...prevData, newRow]);
    };

    const removeProgettiRow = (index) => {
        setProgettiData((prevData) => {
          const newData = [...prevData];
          newData.splice(index, 1);
          return newData;
        });
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
                    <strong>Criteri di valutazione</strong>
                </Accordion.Header>
                <Accordion.Body>
                    <Table striped bordered>
                    <thead>
                        <tr>
                        <th>Voto</th>
                        <th>Giudizio</th>
                        <th>Descrizione</th>
                        </tr>
                    </thead>
                    <tbody>
                      {votiData.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          {row.map((cell, colIndex) => (
                            <td key={colIndex}>
                             <textarea rows="1" class="form-control" id="textareaform" row="3"></textarea>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                    </Table>
                    <button
                    type="submit"
                    className="btn btn-success"
                    >
                    Salva dati
                    </button>
                </Accordion.Body>
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
                              <div
                                className="cell-text"
                                contentEditable="true"
                                dangerouslySetInnerHTML={{ __html: cell }}
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
                              <div
                                className="cell-text"
                                contentEditable="true"
                                dangerouslySetInnerHTML={{ __html: cell }}
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
                                <div
                                    className="cell-text"
                                    contentEditable="true"
                                    dangerouslySetInnerHTML={{ __html: cell }}
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
                                <div
                                  className="cell-text"
                                  contentEditable="true"
                                  dangerouslySetInnerHTML={{ __html: cell }}
                                />
                              </div>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  <div className="button-row">
                    <button
                        type="button"
                        className="btn btn-outline-secondary add-row-button"
                        onClick={addProgettiRow}
                    >
                        + | Aggiungi riga
                    </button>
                    ㅤ
                    <button
                        type="button"
                        className="btn btn-outline-secondary remove-row-button"
                        onClick={() => removeProgettiRow(progettiData.length - 1)}
                        >
                        - | Rimuovi riga
                    </button>
                    <br></br>
                    <br></br>
                    <button
                        type="submit"
                        className="btn btn-success"
                    >
                        Salva dati
                    </button>
                    </div>
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
