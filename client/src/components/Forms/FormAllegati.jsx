import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { useState } from 'react';

const FormAllegati = () => {

    const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aggiungi qui la logica per l'invio del file al server
    console.log(selectedFile);
  };

    return (
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="fileUpload">
            <Form.Label>Carica file</Form.Label>
            <Form.Control type="file" onChange={handleFileChange} />
          </Form.Group>
          <Button variant="primary" type="submit">
            Invia
          </Button>
        </Form>
      );
    
  };
  
  export default FormAllegati;