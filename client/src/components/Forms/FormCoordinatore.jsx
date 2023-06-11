import Accordion from 'react-bootstrap/Accordion';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import io from 'socket.io-client'
import {useEffect, useState, useRef } from 'react';
import SuccessModal from '../Modals/SuccessModal';
import React from 'react';
import { useContext } from 'react';
import { MyArrayContext } from '../MyArrayContext';

const socket = io.connect('http://localhost:3001')

const Form = () => {
    
    
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
        const filename = `.txt`;
        socket.emit('send_message_coordinatore', {filename, message, isChecked, selectedValue})
        alert(selectedValue)
    }

    const [selectedValue, setSelectedValue] = useState(null);

    const handleDropdownSelect = (eventKey) => {
        setSelectedValue(eventKey);
    };
    
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
          }

        socket.on('filecreato_coordinatore', () => {
        setShowModal(true);
        socket.emit('get_files_coordinatore');
        });
    
        socket.on('filecontent', (fileInfo) => {
            setFileContent((prevFileContent) => ({
              ...prevFileContent,
              [fileInfo.filename]: fileInfo.content,
            }));
          });


        socket.emit('get_files_coordinatore');

        socket.on('filecontent', (fileInfo) => {
          setFilePresence((prevFilePresence) => ({
            ...prevFilePresence,
            [fileInfo.filename]: !!fileInfo.content, 
          }));
        });

        return () => {
            socket.off('filecreato_coordinatore');
            socket.off('filecontent');
          };
    }, [textareaValue, socket])

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
                                <br></br>
                                <br></br>
                                <label for="exampleFormControlInput1" class="form-label">Scelta della sezione</label>
                                <DropdownButton
                                    id="dropdown-button-dark-example2"
                                    variant="outline-success"
                                    menuVariant="light"
                                    title={selectedValue || 'Select an option'} 
                                    onSelect={handleDropdownSelect}
                                    className="mt-2">
                                    <Dropdown.Item eventKey="Profilo professionale in uscita" href="#">Profilo professionele in uscita</Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item eventKey="Informazioni sul curricolo" href="#">Informazioni sul curricolo</Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item eventKey="Elenco allievi" href="#">Elenco allievi</Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item eventKey="Elenco candidati esterni" href="#">Elenco candidati esterni</Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item eventKey="Relazione sintetica" href="#">Relazione sintetica</Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item eventKey="Attività di recupero o interventi di sostegno" href="#">Attività di recupero o interventi di sostegno</Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item eventKey="PCTO" href="#">PCTO</Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item eventKey="CLIL" href="#">CLIL</Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item eventKey="Attività e progetti attinenti a Educazione Civica" href="#">Attività e progetti attinenti a Educazione Civica</Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item eventKey="Altre attività di arricchimento dell'offerta formativa" href="#">Altre attività di arricchimento dell'offerta formativa</Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item eventKey="Attività aggiuntive previste dal PTOF" href="#">Attività aggiuntive previste dal PTOF</Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item eventKey="Eventuali attività specifiche di orientamento" href="#">Eventuali attività specifiche di orientamento</Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item eventKey="Criteri di valutazione nel triennio" href="#">Criteri di valutazione nel triennio</Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item eventKey="Criterio di attribuzione credito scolastico e formativo" href="#">Criterio di attribuzione credito scolastico e formativo</Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item eventKey="Simulazione delle prove scritte, date di svolgimento e criteri di valutazione" href="#">Simulazione delle prove scritte, date di svolgimento e criteri di valutazione</Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item eventKey="Prima e seconda prova d'esame scritta" href="#">Prima e seconda prova d'esame scritta</Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item eventKey="Prova d'esame orale" href="#">Prova d'esame orale</Dropdown.Item>
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
                            <Accordion.Header><strong>Profilo professionele in uscita</strong></Accordion.Header>
                            <Accordion.Body>
                            {renderParagraphs(fileContent[`profiloprofessionale.txt`])}
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="1">
                            <Accordion.Header><strong>Informazioni sul curricolo</strong></Accordion.Header>
                            <Accordion.Body>
                            {renderParagraphs(fileContent[`curricolo.txt`])}
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="2">
                            <Accordion.Header><strong>Elenco allievi</strong></Accordion.Header>
                            <Accordion.Body>
                                {renderParagraphs(fileContent[`allievi.txt`])}
                                </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="3">
                            <Accordion.Header><strong>Elenco candidati esterni</strong></Accordion.Header>
                            <Accordion.Body>
                            {renderParagraphs(fileContent[`esterni.txt`])}
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="4">
                            <Accordion.Header><strong>Relazione sintetica</strong></Accordion.Header>
                            <Accordion.Body>
                                {renderParagraphs(fileContent[`relazionesintetica.txt`])}
                                </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="5">
                            <Accordion.Header><strong>Attività di recupero o interventi di sostegno</strong></Accordion.Header>
                            <Accordion.Body>
                                {renderParagraphs(fileContent[`recuperosostegno.txt`])}
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="6">
                            <Accordion.Header><strong>PCTO</strong></Accordion.Header>
                            <Accordion.Body>
                                {renderParagraphs(fileContent[`pcto.txt`])}
                                </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="7">
                            <Accordion.Header><strong>CLIL</strong></Accordion.Header>
                            <Accordion.Body>
                            {renderParagraphs(fileContent[`clil.txt`])}
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="8">
                            <Accordion.Header><strong>Attività e progetti attinenti a Educazione Civica</strong></Accordion.Header>
                            <Accordion.Body>
                                {renderParagraphs(fileContent[`educazionecivica.txt`])}
                                </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="9">
                            <Accordion.Header><strong>Altre attività di arricchimento dell'offerta formativa</strong></Accordion.Header>
                            <Accordion.Body>
                            {renderParagraphs(fileContent[`altro.txt`])}
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="10">
                            <Accordion.Header><strong>Attività aggiuntive previste dal PTOF</strong></Accordion.Header>
                            <Accordion.Body>
                                {renderParagraphs(fileContent[`ptof.txt`])}
                                </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="11">
                            <Accordion.Header><strong>Eventuali attività specifiche di orientamento</strong></Accordion.Header>
                            <Accordion.Body>
                            {renderParagraphs(fileContent[`orientamento.txt`])}
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="12">
                            <Accordion.Header><strong>Criteri di valutazione nel triennio</strong></Accordion.Header>
                            <Accordion.Body>
                                {renderParagraphs(fileContent[`triennio.txt`])}
                                </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="13">
                            <Accordion.Header><strong>Criterio di attribuzione credito scolastico e formativo</strong></Accordion.Header>
                            <Accordion.Body>
                            {renderParagraphs(fileContent[`credito.txt`])}
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="14">
                            <Accordion.Header><strong>Simulazione delle prove scritte, date di svolgimento e criteri di valutazione</strong></Accordion.Header>
                            <Accordion.Body>
                                {renderParagraphs(fileContent[`simscritti.txt`])}
                                </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="15">
                            <Accordion.Header><strong>Prima e seconda prova d'esame scritta</strong></Accordion.Header>
                            <Accordion.Body>
                            {renderParagraphs(fileContent[`scritti.txt`])}
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="16">
                            <Accordion.Header><strong>Prova d'esame orale</strong></Accordion.Header>
                            <Accordion.Body>
                                {renderParagraphs(fileContent[`orale.txt`])}
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