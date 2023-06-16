import React, { useEffect, useState } from 'react';
import { Form, Button, ListGroup } from 'react-bootstrap';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io.connect('http://localhost:3001');

const FormAllegati = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/');
    } else {
      socket.emit('get_file_list');

      socket.on('file_list', (fileList) => {
        setFileList(fileList);
      });

      return () => {
        socket.off('file_list');
      };
    }
  }, []);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleDeleteFile = async (fileName) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:3001/delete/${fileName}`, {
        headers: {
          Authorization: `${token}`,
        }},);
      setFileList((prevList) => prevList.filter((name) => name !== fileName));
      alert('File eliminato correttamente');
    } catch (error) {
      alert('Errore durante l\'eliminazione del file: ' + error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const token = localStorage.getItem('token');
  
    if (selectedFile && selectedFile.type === 'application/pdf') {
      const formData = new FormData();
      formData.append('file', selectedFile);
  
      try {
        await axios.post('http://localhost:3001/upload', formData, {
          headers: {
            Authorization: `${token}`,
          },
        });
  
        setFileList((prevList) => [...prevList, selectedFile.name]);
        alert('File inviato correttamente');
      } catch (error) {
        alert('Errore durante l\'invio del file: ' + error.message);
      }
    } else {
      alert('Il file non è un PDF.');
    }
  };

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="fileUpload">
          <Form.Label>Carica file (solo PDF)</Form.Label>
          <Form.Control type="file" accept=".pdf" onChange={handleFileChange} />
        </Form.Group>
        <Button variant="primary" type="submit">
          Invia
        </Button>
      </Form>
      <hr />
      <h4>Elenco allegati inseriti:</h4>
      <ListGroup>
        {fileList.map((fileName) => (
          <ListGroup.Item key={fileName} style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ flex: '1', fontSize: '14px' }}>{fileName}</span>
            <Button
              variant="danger"
              size="sm"
              onClick={() => handleDeleteFile(fileName)}
              style={{ marginLeft: '10px' }}
            >
              Elimina
            </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default FormAllegati;
