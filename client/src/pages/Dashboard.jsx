import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useContext } from 'react';
import { MyArrayContext } from '../components/MyArrayContext';
import { FaFileAlt } from 'react-icons/fa';
import Button from 'react-bootstrap/Button';

const socket = io.connect('http://localhost:3001');

const Dashboard = () => {
  const [filePresence, setFilePresence] = useState({});
  const { myArray } = useContext(MyArrayContext);
  const filteredArray = myArray.filter((item) => item !== 'coordinatore');

  const renderErrorMessage = (filename) => {
    return (
      <div>
        <span style={{ color: 'red', fontSize: '12px' }}>
          Il file "{filename}" non è presente/non è stato inserito contenuto!
        </span>
      </div>
    );
  };

  const renderSuccessMessage = (filename) => {
    return (
      <div>
        <span style={{ color: 'green', fontSize: '12px' }}>
          Il file "{filename}" è stato caricato correttamente!
        </span>
      </div>
    );
  };

  useEffect(() => {
    socket.emit('dotted_files', { myArray: filteredArray });

    socket.on('filepresence', (data) => {
      const { filename, isPresent } = data;
      setFilePresence((prevFilePresence) => ({
        ...prevFilePresence,
        [filename]: isPresent,
      }));
    });

    socket.on('filedownload', ({ filename }) => {
      alert(filename);
    });

    return () => {
      socket.off('filepresence');
    };
  }, []);

  const isFilePresent = (filename) => {
    return filePresence[filename] || false;
  };

  const isBothFilesPresent = (item) => {
    const programmasvolto = `programmasvolto_${item}.txt`;
    const relazionefinale = `relazionefinale_${item}.txt`;

    return (
      isFilePresent(programmasvolto) && isFilePresent(relazionefinale)
    );
  };

  const downloadFile = (filename) => {
    const downloadUrl = `http://localhost:3001/download/${filename}`;
    window.open(downloadUrl);
  };

  const richiediDocumento = (pageName) => {
    socket.emit('downloadFile', { pageName });
    const filename = `output_${pageName}.pdf`;
    downloadFile(filename);
  };

  return (
    <div>
      <div className="title">Dashboard</div>
      {myArray.map((item, index) => (
        <div key={index}>
          {item === 'coordinatore' ? (
            <h3>{item.charAt(0).toUpperCase() + item.slice(1)}</h3>
          ) : (
            <div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <h3>{item.charAt(0).toUpperCase() + item.slice(1)}</h3>
                {isBothFilesPresent(item) && (
                  <>
                    <Button
                      variant="primary"
                      onClick={() => richiediDocumento(item)}
                      style={{ marginLeft: '10px' }}
                    >
                      <FaFileAlt style={{ verticalAlign: 'middle', }} />
                    </Button>
                    <span style={{ color: 'blue', fontSize: '12px', marginLeft: '5px' }}>
                      Scarica il documento
                    </span>
                  </>
                )}
              </div>
              <ul>
                <li>
                  Relazione finale{' '}
                  {isFilePresent(`relazionefinale_${item}.txt`) ? (
                    <span style={{ color: 'green' }}>&#9679;</span>
                  ) : (
                    <span style={{ color: 'red' }}>&#9679;</span>
                  )}
                  {!isFilePresent(`relazionefinale_${item}.txt`) && (
                    renderErrorMessage(`relazionefinale_${item}.txt`)
                  )}
                  {isFilePresent(`relazionefinale_${item}.txt`) && (
                    renderSuccessMessage(`relazionefinale_${item}.txt`)
                  )}
                </li>

                <li>
                  Programma svolto{' '}
                  {isFilePresent(`programmasvolto_${item}.txt`) ? (
                    <span style={{ color: 'green' }}>&#9679;</span>
                  ) : (
                    <span style={{ color: 'red' }}>&#9679;</span>
                  )}
                  {!isFilePresent(`programmasvolto_${item}.txt`) && (
                    renderErrorMessage(`programmasvolto_${item}.txt`)
                  )}
                  {isFilePresent(`programmasvolto_${item}.txt`) && (
                    renderSuccessMessage(`programmasvolto_${item}.txt`)
                  )}
                </li>
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
