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
  const filteredArray = myArray.filter(item => item !== 'coordinatore');
  

  useEffect(() => {
    socket.emit('dotted_files', { myArray: filteredArray });

    socket.on('filepresence', (data) => {
        const { filename, isPresent } = data;
        setFilePresence((prevFilePresence) => ({
          ...prevFilePresence,
          [filename]: isPresent,
        }));
      });


    socket.on('filedownload', ({filename})=>{
        alert(filename)
    })
    

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
                    <Button variant="primary" onClick={() => richiediDocumento(item)} style={{ marginLeft: '10px' }}>
                        <FaFileAlt /> {/* Render the document icon */}
                    </Button>
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
                </li>

                <li>
                  Programma svolto{' '}
                  {isFilePresent(`programmasvolto_${item}.txt`) ? (
                    <span style={{ color: 'green' }}>&#9679;</span>
                  ) : (
                    <span style={{ color: 'red' }}>&#9679;</span>
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
