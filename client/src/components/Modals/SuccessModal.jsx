import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


const SuccessModal = ({ show, onClose }) => {
    return (
      <Modal show={show} onHide={onClose}>
        <Modal.Header closeButton>
          <Modal.Title>Operazione eseguita</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>L'operazione è stata eseguita con successo</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={onClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

export default SuccessModal;