import Accordion from 'react-bootstrap/Accordion';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import io from 'socket.io-client'
import {useEffect, useState, useRef } from 'react';
import SuccessModal from './Modals/SuccessModal';
import React from 'react';
import { useContext } from 'react';
import { MyArrayContext } from '../components/MyArrayContext';

const socket = io.connect('http://localhost:3001')

const Form = ({ pageName }) => {
    
    
    const [isChecked, setIsChecked] = useState(false);
    const [showModal, setShowModal] = useState(false);


    const [textareaValue, setTextareaValue] = useState('');
    const textareaRef = useRef(null);

    const [fileContent, setFileContent] = useState({});

    
    

    const handleCloseModal = () => {
        setShowModal(false);
      };

    const handleCheckboxChange = (event) => {
        setIsChecked(event.target.checked);
    };

    const handleChange = (event) => {
        setTextareaValue(event.target.value);
      };


    const handleInputChange = (event) => {
        setMessage(event.target.value)
        handleChange(event)
    };

    const [message, setMessage] = useState('')

    const sendMessage = () =>{
        const filename = `${pageName}.txt`;
        socket.emit('send_message', {filename, message, isChecked, selectedValue})
    }

    const [selectedValue, setSelectedValue] = useState(null);

    const handleDropdownSelect = (eventKey) => {
        setSelectedValue(eventKey);
    };
    
    useEffect(() => {
        socket.on('filecreato', () => {
            setShowModal(true);
            socket.emit('get_files', {pageName});
        })

        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
          }


        socket.on('filecontent', (fileInfo) => {
            setFileContent((prevFileContent) => ({
              ...prevFileContent,
              [fileInfo.filename]: fileInfo.content,
            }));
          });


        socket.emit('get_files', {pageName});

        socket.on('filecontent', (fileInfo) => {
          setFilePresence((prevFilePresence) => ({
            ...prevFilePresence,
            [fileInfo.filename]: !!fileInfo.content, 
          }));
        });

        return () => {
            socket.off('filecreato');
            socket.off('filecontent');
          };
    }, [textareaValue], [socket])

    const renderParagraphs = (paragraphs) => {
        if (!paragraphs || paragraphs.length === 0) {
          return null; 
        }
      
        return paragraphs.map((paragraph, index) => (
          <React.Fragment key={index}>
            {paragraph.split('\n').map((line, lineIndex) => (
              <p key={`${index}-${lineIndex}`}>{line}</p>
            ))}
          </React.Fragment>
        ));
      };

    /*useEffect(() => {
        socket.on('receive_message', (data) => {
            setMessageReceived(data.message)
        })
    }), [socket]*/


    return (
        <>
          <div class="container-fluid">
                    <div class="row">
                        <div class="col">
                            <div class="mb-3">
                                <label for="exampleFormControlInput1" class="form-label">Scelta della sezione</label>
                                <DropdownButton
                                    id="dropdown-button-dark-example2"
                                    variant="outline-success"
                                    menuVariant="light"
                                    title={selectedValue || 'Select an option'} 
                                    onSelect={handleDropdownSelect}
                                    className="mt-2">
                                    <Dropdown.Item eventKey="Relazione finale" href="#">Relazione finale</Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item eventKey="Programma svolto" href="#">Programma svolto</Dropdown.Item>
                                </DropdownButton>
                            </div>
                            <div class="mb-3">
                                <label for="exampleFormControlTextarea1" class="form-label">Testo</label>
                                <textarea ref={textareaRef} value={textareaValue} rows="1" onChange={handleInputChange} class="form-control" id="textareaform" row="3"></textarea>
                            </div>
                            <div class="mb-3 form-check">
                                <input type="checkbox" class="form-check-input" id="check" checked={isChecked} onChange={handleCheckboxChange}/>
                                <label class="form-check-label" for="check">Sovrascrivi</label>
                            </div>
                            <button type="submit" class="btn btn-success" onClick={sendMessage}/*onClick={() => exportFile()}*/>Invio</button>
                            <SuccessModal show={showModal} onClose={handleCloseModal} />
                        </div>
                    </div> 
                    <br/> 
                    <div class="row">
                        <div class="col">
                          <h4>Anteprima documenti</h4>
                        <Accordion defaultActiveKey="0">
                        <Accordion.Item eventKey="0">
                            <Accordion.Header><strong>Relazione finale</strong></Accordion.Header>
                            <Accordion.Body>
                            {renderParagraphs(fileContent[`relazionefinale_${pageName}.txt`])}
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="1">
                            <Accordion.Header><strong>Programma svolto</strong></Accordion.Header>
                            <Accordion.Body>
                                {renderParagraphs(fileContent[`programmasvolto_${pageName}.txt`])}
                                </Accordion.Body>
                        </Accordion.Item>
                        </Accordion>
                        </div>
                    </div>           
                </div>
      </>
  )
};

export default Form;