import React, { useState, useEffect, useRef } from 'react';
import { Table } from 'react-bootstrap';
import Accordion from 'react-bootstrap/Accordion';
import AccordionBody from 'react-bootstrap/esm/AccordionBody';
import AccordionHeader from 'react-bootstrap/esm/AccordionHeader';
import AccordionItem from 'react-bootstrap/esm/AccordionItem';
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

const Tabelle = () => {
    const numRows = 36;
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

      const handleSaveData = (tableData, filename) => {
        const data = {
          filename: filename,
          tableData: tableData,
        };
        alert(tableData)
        socket.emit('save_table', data);
      };
    
      const handleSaveConsiglioData = () => {
        handleSaveData(consiglioData, 'tabella_consiglio.txt');
      };

      const handleSaveStoriaClasseData = () => {
        handleSaveData(storiaClasseData, 'tabella_storiaclasse.txt');
      };

      const handleSaveDocentiData = () => {
        handleSaveData(docentiData, 'tabella_docenti.txt');
      };

      const handleSaveProgettiData = () => {
        handleSaveData(progettiData, 'tabella_progetti.txt');
      };

      const handleSaveVotiData = () => {
        handleSaveData(votiData, 'tabella_voti.txt');
      };

      const handleConsiglioCellValueChange = (rowIndex, colIndex, value) => {
        const updatedData = [...consiglioData];
        updatedData[rowIndex][colIndex] = value;
        setConsiglioData(updatedData);
      };

      const handleDocentiCellValueChange = (rowIndex, colIndex, value) => {
        const updatedData = [...docentiData];
        updatedData[rowIndex][colIndex] = value;
        setDocentiData(updatedData);
      };

      const handleVotiCellValueChange = (rowIndex, colIndex, value) => {
        const updatedData = [...votiData];
        updatedData[rowIndex][colIndex] = value;
        setVotiData(updatedData);
      };

      const handleStoriaCellValueChange = (rowIndex, colIndex, value) => {
        const updatedData = [...storiaClasseData];
        updatedData[rowIndex][colIndex] = value;
        setStoriaClasseData(updatedData);
      };

      const handleProgettiCellValueChange = (rowIndex, colIndex, value) => {
        const updatedData = [...progettiData];
        updatedData[rowIndex][colIndex] = value;
        setProgettiData(updatedData);
      };

      useEffect(() => {
        socket.on('table_data', ({ filename, data }) => {
          switch (filename) {
            case 'tabella_voti.txt':
              setVotiData(data);
              break;
            case 'tabella_docenti.txt':
              setDocentiData(data);
              break;
            case 'tabella_consiglio.txt':
              setConsiglioData(data);
              break;
            case 'tabella_progetti.txt':
              setProgettiData(data);
              break;
            case 'tabella_storiaclasse.txt':
              setStoriaClasseData(data);
              break;
            default:
              break;
          }
        });
      
        socket.emit('get_table');
      }, []);
      
      

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
                             <textarea rows="1" class="form-control" 
                             id="textareaform"
                             value={cell}
                             onChange={(e) => handleVotiCellValueChange(rowIndex, colIndex, e.target.value)} 
                             row="3"></textarea>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                    </Table>
                    <button
                    type="submit"
                    className="btn btn-success"
                    onClick={handleSaveVotiData}
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
                              <textarea rows="1" value={cell} class="form-control" onChange={(e) => handleConsiglioCellValueChange(rowIndex, colIndex, e.target.value)}  id="textareaform" row="3"></textarea>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                <button
                    type="submit"
                    className="btn btn-success"
                    onClick={handleSaveConsiglioData}
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
                              <textarea rows="1" value={cell} class="form-control" onChange={(e) => handleStoriaCellValueChange(rowIndex, colIndex, e.target.value)}  id="textareaform" row="3"></textarea>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  <button
                    type="submit"
                    className="btn btn-success"
                    onClick={handleSaveStoriaClasseData}
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
                                <textarea rows="1" value={cell} class="form-control" onChange={(e) => handleDocentiCellValueChange(rowIndex, colIndex, e.target.value)}  id="textareaform" row="3"></textarea>
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
                    onClick={handleSaveDocentiData}
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
                              <textarea rows="1" value={cell} class="form-control" onChange={(e) => handleProgettiCellValueChange(rowIndex, colIndex, e.target.value)}  id="textareaform" row="3"></textarea>
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
                        onClick={handleSaveProgettiData}
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
