import React, { useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import { Table } from 'react-bootstrap';

const Tabelle = () => {

    const [tableData, setTableData] = useState([
        ['Disciplina del piano di studi', 'Ore svolte', 'Docente', 'Firma di approvazione'],
        ['', '', '', ''],
        ['', '', '', ''],
        ['', '', '', ''],
        ['', '', '', ''],
        ['', '', '', ''],
        ['', '', '', ''],
        ['', '', '', ''],
        ['', '', '', ''],
        ['', '', '', ''],
        ['', '', '', '']
      ]);
    
      const handleCellChange = (e, rowIndex, colIndex) => {
        if (rowIndex === 0 || colIndex === 0) {
          return; // Non modificare la prima riga o la prima colonna
        }
    
        const newData = [...tableData];
        newData[rowIndex][colIndex] = e.target.value;
        setTableData(newData);
      };

  return (
    <div>
      <div className="title">Tabelle</div>
      <div className='container-fluid'>
      <div class="row">
                        <div class="col">
                        <Accordion defaultActiveKey="0">
                        <Accordion.Item eventKey="0">
                            <Accordion.Header><strong>Quadro orario</strong></Accordion.Header>
                            <Accordion.Body>tab1
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="1">
                            <Accordion.Header><strong>Composizione del Consiglio di Classe</strong></Accordion.Header>
                            <Accordion.Body>
                            <Table striped bordered>
                                <thead>
                                <tr>
                                    {tableData[0].map((cell, colIndex) => (
                                    <th key={colIndex}>{cell}</th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody>
                                {tableData.slice(1).map((row, rowIndex) => (
                                    <tr key={rowIndex}>
                                    {row.map((cell, colIndex) => (
                                        <td key={colIndex}>
                                        <input
                                            type="text"
                                            value={cell}
                                            onChange={(e) => handleCellChange(e, rowIndex + 1, colIndex)}
                                            readOnly={rowIndex === 0 || colIndex === 0}
                                        />
                                        </td>
                                    ))}
                                    </tr>
                                ))}
                                </tbody>
                            </Table>
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="2">
                            <Accordion.Header><strong>Storia della classe e continuità didattica nel triennio</strong></Accordion.Header>
                            <Accordion.Body>tab3
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="3">
                            <Accordion.Header><strong>Continuità dei docenti</strong></Accordion.Header>
                            <Accordion.Body>La titolarità dei docenti delle singole materie di corso, nell'arco dei tre anni, si riassume come segue.
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="4">
                            <Accordion.Header><strong>Progetti PCTO</strong></Accordion.Header>
                            <Accordion.Body>tab4
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
