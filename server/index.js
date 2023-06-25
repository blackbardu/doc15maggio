const express = require('express')
const app = express()
const http = require('http')
const {Server} = require('socket.io')
const cors = require('cors')
const fs = require('fs-extra')
const fileUpload = require('express-fileupload');
const path = require('path');
const PdfPrinter = require('pdfmake');
const jwt = require('jsonwebtoken');
const jwtSecretKey = 'RickBardu';
const { PDFDocument,rgb, degrees } = require('pdf-lib');
const fontkit = require('@pdf-lib/fontkit');



app.use(cors())

app.use(fileUpload());
const server = http.createServer(app)

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ success: false, error: 'Authorization token missing.' });
  }

  jwt.verify(token, jwtSecretKey, (err, decoded) => {
    if (err) {
      console.log('token: '+token)
      console.log('jwtsecret: '+jwtSecretKey)
      console.log(err)
      return res.status(401).json({ success: false, error: 'Invalid token.' });
    }
    req.user = decoded;
    next();
  });
};

app.use(authenticateToken);

app.get('/download/:filename', authenticateToken, (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, filename);

  fs.access(filePath, fs.constants.R_OK, (err) => {
    if (err) {
      console.error(err);
      res.status(404).send('File not found');
    } else {
      const fileStream = fs.createReadStream(filePath);

      fileStream.pipe(res);
    }
  });
});



app.delete('/delete/:filename',authenticateToken, (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'Allegati', filename);

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Errore durante l\'eliminazione del file.');
    } else {
      console.log('File eliminato:', filename);
      res.status(200).send('File eliminato correttamente.');
    }
  });
});

app.post('/upload',authenticateToken, (req, res) => {
  if (req.files) {
    const file = req.files.file;
    const originalFileName = file.name;
    const savePath = path.join(__dirname, 'Allegati', originalFileName);

    file.mv(savePath, (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Errore durante il salvataggio del file.');
      } else {
        console.log('File salvato:', originalFileName);
        res.status(200).send('File salvato correttamente.');
      }
    });
  } else {
    res.status(400).send('Nessun file caricato.');
  }
});

const parseTableData = (tableString) => {
  const rows = tableString.split('\n');
  const tableData = [];

  for (let row of rows) {
    const cells = row.split('\t');
    tableData.push(cells);
  }

  return tableData;
};


const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ["GET", "POST"],
    },
}) 

var fonts = {
  Roboto: {
    normal: 'node_modules/dejavu-fonts-ttf/ttf/DejaVuSans.ttf',
    bold: 'node_modules/dejavu-fonts-ttf/ttf/DejaVuSans-Bold.ttf',
    italics: 'node_modules/dejavu-fonts-ttf/ttf/DejaVuSans.ttf',
    bolditalics: 'node_modules/dejavu-fonts-ttf/ttf/DejaVuSans.ttf'
  }
}

const printer = new PdfPrinter(fonts);


io.on('connection', (socket) => {

    
    console.log(`User connected: ${socket.id}`)

    socket.on('send_message', (data) => {
        const {filename, message, isChecked, selectedValue} = data
        console.log(`Nome file: ${filename}`);
        console.log(`Info: ${message}`);
        console.log(`Check: ${isChecked}`);
        console.log(`Titolo: ${selectedValue}`);

        var newFileName = "";

        switch(selectedValue)
        {
            case "Relazione finale":
                newFileName='relazionefinale_'+filename
                break
            case "Programma svolto":
                newFileName='programmasvolto_'+filename
                break

        }

        if (isChecked) {
            fs.writeFile(newFileName, message, (err) => {
              if (err) {
                console.error(err);
                return;
              }
              console.log('Text file created successfully.');
              io.emit('filecreato');
              const isEmpty = /^\s*$/.test(message);
              console.log('empty:'+isEmpty)
              if (isEmpty == false) {
                socket.emit('filepresence', { newFileName, isPresent: !isEmpty });
                console.log(newFileName, !isEmpty);
              }
              readFiles(socket);
            });
          } else {
            fs.appendFile(newFileName, `\n${message}`, (err) => {
              if (err) {
                console.error(err);
                return;
              }
              console.log('Text file updated successfully.');
              io.emit('filecreato');
              const isEmpty = /^\s*$/.test(message);
              console.log('empty:'+isEmpty)
              if (isEmpty == false) {
                socket.emit('filepresence', { newFileName, isPresent: !isEmpty });
                console.log(newFileName, !isEmpty);
              }
              readFiles(socket);
            });
          }
        
    })

    socket.on('get_file_list', () => {
      const allegatiDir = path.join(__dirname, 'Allegati');
      fs.readdir(allegatiDir, (err, files) => {
        if (err) {
          console.error('Impossibile leggere la directory degli allegati:', err);
          return;
        }
  
        const fileList = files.filter((file) => fs.statSync(path.join(allegatiDir, file)).isFile());
        socket.emit('file_list', fileList);
      });
    });  
    
    
    

    socket.on('save_table', (data) => {
      const { filename, tableData } = data;
      const filePath = path.join(__dirname, filename);
      const formattedTableData = formatTableData(tableData);
    
      const transformedTableData = tableData.map((row) => {
        return row.map((cell) => cell.replace(/\n/g, ' '));
      });
    
      const formattedTransformedTableData = formatTableData(transformedTableData);
    
      fs.writeFile(filePath, formattedTransformedTableData, (err) => {
        if (err) {
          console.error(err);
          socket.emit('save_table_error', { error: 'Failed to save table data.' });
          return;
        }
    
        console.log('Table data saved successfully.');
        socket.emit('save_table_success', { message: 'Table data saved successfully.' });
        
      });

      
    });
    

    socket.on('send_message_coordinatore', (data) => {
      const {filename, message, isChecked, selectedValue} = data
      console.log(`Nome file: ${filename}`);
      console.log(`Info: ${message}`);
      console.log(`Check: ${isChecked}`);
      console.log(`Titolo: ${selectedValue}`);

      var newFileName = "";

      switch(selectedValue)
      {
          case "Memorandum per i candidati":
            newFileName='memorandum'+filename
            break
          case "Profilo professionale in uscita":
              newFileName='profiloprofessionale'+filename
              break
          case "Informazioni sul curricolo":
              newFileName='curricolo'+filename
              break
          case "Elenco allievi":
              newFileName='allievi'+filename
              break
          case "Elenco candidati esterni":
              newFileName='esterni'+filename
              break
          case "Relazione sintetica":
              newFileName='relazionesintetica'+filename
              break
          case "Attività di recupero o interventi di sostegno":
              newFileName='recuperosostegno'+filename
              break
          case "PCTO":
              newFileName='pcto'+filename
              break
          case "CLIL":
              newFileName='clil'+filename
              break
          case "Attività e progetti attinenti a Educazione Civica":
              newFileName='educazionecivica'+filename
              break
          case "Altre attività di arricchimento dell'offerta formativa":
              newFileName='altro'+filename
              break
          case "Attività aggiuntive previste dal PTOF":
              newFileName='ptof'+filename
              break
          case "Eventuali attività specifiche di orientamento":
              newFileName='orientamento'+filename
              break
          case "Criteri di valutazione nel triennio":
              newFileName='triennio'+filename
              break
          case "Criterio di attribuzione credito scolastico e formativo":
              newFileName='credito'+filename
              break
          case "Simulazione delle prove scritte, date di svolgimento e criteri di valutazione":
              newFileName='simscritti'+filename
              break
          case "Prima e seconda prova d'esame scritta":
              newFileName='scritti'+filename
              break
          case "Prova d'esame orale":
              newFileName='orale'+filename
              break         


      }

      if (isChecked) {
          fs.writeFile(newFileName, message, (err) => {
            if (err) {
              console.error(err);
              return;
            }
            console.log('Text file created successfully.');
            io.emit('filecreato_coordinatore');
            readFiles(socket)
          });
        } else {
          fs.appendFile(newFileName, `\n${message}`, (err) => {
            if (err) {
              console.error(err);
              return;
            }
            console.log('Text file updated successfully.');
            io.emit('filecreato_coordinatore');
            readFiles(socket)
          });
        }
      
  })

    socket.on('get_files', (pageName) => {
        

        readFiles(socket)

        if (typeof pageName === 'object' && pageName !== null) {
            if (pageName.hasOwnProperty('pageName')) {
              const page = pageName.pageName;

              const filePrefixes = ['relazionefinale', 'programmasvolto'];
    
                filePrefixes.forEach((prefix) => {
                fs.readFile(`${prefix}_${page}.txt`, 'utf8', (err, content) => {
                    if (err) {
                    console.error(err);
                    return;
                    }
                    const fileInfo = {
                    filename: `${prefix}_${pageName}.txt`,
                    content: content,
                    };
                    socket.emit('filecontent', fileInfo);
                });
                });
            }
        }
        
      });

      socket.on('get_files_coordinatore',() => {
        

        readFiles(socket)

        const filePrefixes = ['memorandum', 'profiloprofessionale', 'curricolo', 'allievi', 'esterni', 'relazionesintetica', 'recuperosostegno', 'pcto', 'clil', 'educazionecivica', 'altro', 'ptof', 'orientamento', 'triennio', 'credito', 'simscritti', 'scritti', 'orale'];
    
        filePrefixes.forEach((prefix) => {
        fs.readFile(`${prefix}.txt`, 'utf8', (err, content) => {
            if (err) {
            console.error(err);
            return;
            }
            const fileInfo = {
            filename: `${prefix}.txt`,
            content: content,
            };
            socket.emit('filecontent_coordinatore', fileInfo);
        });
        });
        
      });

    readFiles(socket);
      

    socket.on('dotted_files', (myArray) =>{
      console.log(myArray.myArray)
      readDottedFiles(socket, myArray.myArray)

    })

    socket.on('get_table', () => {
      const tableFilenames = ['tabella_voti.txt', 'tabella_docenti.txt', 'tabella_consiglio.txt', 'tabella_progetti.txt', 'tabella_storiaclasse.txt'];
    
      tableFilenames.forEach((filename) => {
        const filePath = path.join(__dirname, filename);
    
        fs.readFile(filePath, 'utf8', (err, content) => {
          if (err) {
            console.error(err);
            socket.emit('table_error', { error: `Failed to read table data for ${filename}.` });
            return;
          }
    
          const tableData = parseTableData(content);
          console.log(tableData)
          socket.emit('table_data', { filename, data: tableData });
        });
      });
    });
    

    socket.on('downloadFile', ({ pageName }) => {
      const programmasvoltoFile = `programmasvolto_${pageName}.txt`;
      const relazionefinaleFile = `relazionefinale_${pageName}.txt`;
      console.log(pageName)

      var labelPagina = pageName.charAt(0).toUpperCase() + pageName.slice(1)
      switch(labelPagina){
        case 'Sistemi':
          labelPagina='Sistemi e reti'
          break;
        case 'Italiano':
          labelPagina='Lingua e letteratura italiana'
          break;
        case 'Tpsit':
          labelPagina='Tecnologie e progettazione di sistemi informatici e di telecomunicazioni'
          break;
        case 'Gpoi':
          labelPagina='Gestione progetto, organizzazione d‟impresa'
          break;
        case 'Ginnastica':
          labelPagina='Scienze motorie sportive'
          break;
        case 'Religione':
          labelPagina='Religione cattolica'
        default:
          break;
      }

      console.log(labelPagina)
    
      const programmasvoltoContent = fs.readFileSync(programmasvoltoFile, 'utf8');
      const relazionefinaleContent = fs.readFileSync(relazionefinaleFile, 'utf8');
    
      const docDefinition = {
        content: [
          { text: labelPagina, style: 'header'},
          { text: 'Relazione finale', style: 'header' },
          { text: relazionefinaleContent },
          { text: 'Programma svolto', style: 'header' },
          { text: programmasvoltoContent },
          
        ],
        styles: {
          header: {
            fontSize: 18,
            bold: true,
            margin: [0, 10, 0, 5],
          },
        },
      };
    
      const pdfDoc = printer.createPdfKitDocument(docDefinition);
      const filePath = path.join(__dirname, `output_${pageName}.pdf`);
    
      pdfDoc.pipe(fs.createWriteStream(filePath));
      pdfDoc.end();
    
      socket.emit('filedownload', { filename: `output_${pageName}.pdf` });
    });

    socket.on('document_creation',() =>{


      const programmasvoltoFileItaliano = fs.readFileSync(`programmasvolto_italiano.txt`, 'utf8');
      const relazionefinaleFileItaliano = fs.readFileSync(`relazionefinale_italiano.txt`, 'utf8');

      const programmasvoltoFileStoria = fs.readFileSync(`programmasvolto_storia.txt`, 'utf8');
      const relazionefinaleFileStoria = fs.readFileSync(`relazionefinale_storia.txt`, 'utf8');

      const programmasvoltoFileMatematica = fs.readFileSync(`programmasvolto_matematica.txt`, 'utf8');
      const relazionefinaleFileMatematica = fs.readFileSync(`relazionefinale_matematica.txt`, 'utf8');

      const programmasvoltoFileInglese = fs.readFileSync(`programmasvolto_inglese.txt`, 'utf8');
      const relazionefinaleFileInglese = fs.readFileSync(`relazionefinale_inglese.txt`, 'utf8');

      const programmasvoltoFileTpsit = fs.readFileSync(`programmasvolto_tpsit.txt`, 'utf8');
      const relazionefinaleFileTpsit = fs.readFileSync(`relazionefinale_tpsit.txt`, 'utf8');

      const programmasvoltoFileGpoi = fs.readFileSync(`programmasvolto_gpoi.txt`, 'utf8');
      const relazionefinaleFileGpoi = fs.readFileSync(`relazionefinale_gpoi.txt`, 'utf8');

      const programmasvoltoFileInformatica = fs.readFileSync(`programmasvolto_informatica.txt`, 'utf8');
      const relazionefinaleFileInformatica = fs.readFileSync(`relazionefinale_informatica.txt`, 'utf8');

      const programmasvoltoFileSistemi = fs.readFileSync(`programmasvolto_sistemi.txt`, 'utf8');
      const relazionefinaleFileSistemi = fs.readFileSync(`relazionefinale_sistemi.txt`, 'utf8');

      const programmasvoltoFileReligione = fs.readFileSync(`programmasvolto_religione.txt`, 'utf8');
      const relazionefinaleFileReligione = fs.readFileSync(`relazionefinale_religione.txt`, 'utf8');

      const programmasvoltoFileGinnastica = fs.readFileSync(`programmasvolto_ginnastica.txt`, 'utf8');
      const relazionefinaleFileGinnastica = fs.readFileSync(`relazionefinale_ginnastica.txt`, 'utf8');

      const provaEsameoraleFile = fs.readFileSync(`orale.txt`, 'utf8');
      const provaEsamescrittoFile = fs.readFileSync(`scritti.txt`, 'utf8');

      const simprovaScrittaFile = fs.readFileSync(`simscritti.txt`, 'utf8');

      const valutazioneFile = fs.readFileSync(`triennio.txt`, 'utf8');
      const creditiFile = fs.readFileSync(`credito.txt`, 'utf8');

      const attivitarecuperoFile = fs.readFileSync(`recuperosostegno.txt`, 'utf8');
      const pctoFile = fs.readFileSync(`pcto.txt`, 'utf8');
      const clilFile = fs.readFileSync(`clil.txt`, 'utf8');
      const educazionecivicaFile = fs.readFileSync(`educazionecivica.txt`, 'utf8');
      const altreattivitaFile = fs.readFileSync(`altro.txt`, 'utf8');
      const ptofpofFile = fs.readFileSync(`ptof.txt`, 'utf8');
      const orientamentoFile = fs.readFileSync(`orientamento.txt`, 'utf8');

      const allieviFile = fs.readFileSync(`allievi.txt`, 'utf8');
      const esterniFile = fs.readFileSync(`esterni.txt`, 'utf8');
      const relazioneFile = fs.readFileSync(`relazionesintetica.txt`, 'utf8');

      const profiloFile = fs.readFileSync(`profiloprofessionale.txt`, 'utf8');

      const memorandumFile = fs.readFileSync(`memorandum.txt`, 'utf8');

      const tabellaVotiFile = fs.readFileSync('tabella_voti.txt', 'utf8');
      const tabellaConsiglioFile = fs.readFileSync('tabella_consiglio.txt', 'utf8');
      const tabellaDocentiFile = fs.readFileSync('tabella_docenti.txt', 'utf8');
      const tabellaProgettiFile = fs.readFileSync('tabella_progetti.txt', 'utf8');
      const tabellaStoriaFile = fs.readFileSync('tabella_storiaclasse.txt', 'utf8');

      const tableVotiData = parseTableData(tabellaVotiFile)
      const tableConsiglioData = parseTableData(tabellaConsiglioFile)
      const tableDocentiData = parseTableData(tabellaDocentiFile)
      const tableProgettiData = parseTableData(tabellaProgettiFile)
      const tableStoriaData = parseTableData(tabellaStoriaFile)

      tableVotiData.unshift(['Voto', 'Giudizio', 'Descrizione']);
      tableConsiglioData.unshift(['Disciplina del piano di studi', 'Ore svolte', 'Docente','Firma di approvazione']);
      tableDocentiData.unshift(['Materia', 'Classe', 'A.S', 'Docente']);
      tableProgettiData.unshift(['Cognome', 'Nome', 'Titolo progetto e descrizione', 'Descrizione, discipline e contenuti']);
      tableStoriaData.unshift(['Anno', 'Iscritti', 'Ritirati', 'Promossi','Respinti']);


      const docDefinition = {
        content: [
          {
            // to treat a paragraph as a bulleted list, set an array of items under the ul key
            ol: [
              {text: 'Memorandum per i candidati', margin: [0, 5, 0, 5]},
              {
                stack: [
                  'Informazioni sul curricolo',
                  {
                    ul: [
                      'Profilo professionale in uscita',
                      'Quadro orario',
                    ],
                  }
                ],
                margin: [0, 5, 0, 5]
              },
              {
                stack: [
                  'Presentazione della classe',
                  {
                    ul: [
                      'Composizione del consiglio di classe',
                      'Elenco allievi',
                      'Elenco candidati esterni',
                      'Storia della classe e continuità didattica nel triennio',
                      'Relazione sintetica',
                    ],
                  }
                ],
                margin: [0, 5, 0, 5]
              },
              {
                stack: [
                  'Indicazione generale attività didattica e progetti',
                  {
                    ul: [
                      'Attività di recupero o interventi di sostegno',
                      `Percorsi per le competenze trasversali e l'orientamento (PCTO)`,
                      'CLIL: attività e modalità di insegnamento',
                      'Attività e progetti attinenti a "Educazione civica"',
                      `Altre attività di arricchimento dell'offerta formativa`,
                      `Attività aggiuntive pomeridiane previste dal PTOF d'Istituto e progetto dal POF di classe`,
                      'Eventuali attività specifiche di orientamento',
                    ],
                  }
                ],
                margin: [0, 5, 0, 5]
              },  
              {
                stack: [
                  'Criteri di valutazione',
                  {
                    ul: [
                      'Criteri di valutazione nel triennio',
                      'Criteri di attribuzione crediti scolastici e formativi',
                    ],
                  }
                ],
                margin: [0, 5, 0, 5]
              },
              {
                stack: [
                  'Simulazione delle prove scritte',
                  {
                    ul: [
                      'Simulazione delle prove scritte, date di svolgimento e criteri di valutazione',
                    ],
                  }
                ],
                margin: [0, 5, 0, 5]
              },
              {
                stack: [
                  `Criteri di valutazione per l'esame`,
                  {
                    ul: [
                      'Prima e seconda prova d‟esame scritta',
                      'Prova d‟esame orale',
                    ],
                  }
                ],
                margin: [0, 5, 0, 5]
              },  
              {
                stack: [
                  'Contenuti delle singolo discipline (Programmi disciplinari)',
                  {
                    ul: [
                      {
                        stack: [
                          'Lingua e letteratura italiana',
                          {
                            ul: [
                              'Relazione finale',
                              `Programma svolto`,
                            ],
                          }
                        ],
                        margin: [0, 5, 0, 5]
                      }, 
                      {
                        stack: [
                          'Storia',
                          {
                            ul: [
                              'Relazione finale',
                              `Programma svolto`,
                            ],
                          }
                        ],
                        margin: [0, 5, 0, 5]
                      },  
                      {
                        stack: [
                          'Inglese',
                          {
                            ul: [
                              'Relazione finale',
                              `Programma svolto`,
                            ],
                          }
                        ],
                        margin: [0, 5, 0, 5]
                      }, 
                      {
                        stack: [
                          'Matematica',
                          {
                            ul: [
                              'Relazione finale',
                              `Programma svolto`,
                            ],
                          }
                        ],
                        margin: [0, 5, 0, 5]
                      },  
                      {
                        stack: [
                          'Informatica',
                          {
                            ul: [
                              'Relazione finale',
                              `Programma svolto`,
                            ],
                          }
                        ],
                        margin: [0, 5, 0, 5]
                      }, 
                      {
                        stack: [
                          'Sistemi e reti',
                          {
                            ul: [
                              'Relazione finale',
                              `Programma svolto`,
                            ],
                          }
                        ],
                        margin: [0, 5, 0, 5]
                      },  
                      {
                        stack: [
                          'Tecnologie e progettazione di sistemi informatici e di telecomunicazioni',
                          {
                            ul: [
                              'Relazione finale',
                              `Programma svolto`,
                            ],
                          }
                        ],
                        margin: [0, 5, 0, 5]
                      }, 
                      {
                        stack: [
                          `Gestione progetto, organizzazione d'impresa`,
                          {
                            ul: [
                              'Relazione finale',
                              `Programma svolto`,
                            ],
                          }
                        ],
                        margin: [0, 5, 0, 5]
                      },  
                      {
                        stack: [
                          'Scienze motorie sportive',
                          {
                            ul: [
                              'Relazione finale',
                              `Programma svolto`,
                            ],
                          }
                        ],
                        margin: [0, 5, 0, 5]
                      }, 
                      {
                        stack: [
                          `Religione cattolica`,
                          {
                            ul: [
                              'Relazione finale',
                              `Programma svolto`,
                            ],
                          }
                        ],
                        margin: [0, 5, 0, 5]
                      }, 
                    ],
                  }
                ],
              },              
              
              
              
              
              
              

            ],
            pageBreak: 'after'
          },

          { text: `Memorandum per i candidati`, style: 'title'},
          { text: memorandumFile },

          { text: `Informazioni sul curricolo`, style: 'title'},

          { text: `▪ Profilo professionale in uscita`, style: 'header' },
          { text: profiloFile },
          { text: `▪ Quadro orario`, style: 'header' },
          {table: {
            headerRows: 1,
            widths: [ '*', '*', 100, '*', 'auto' ],
    
            body: [
              [ { text: 'Materia', bold: true },{ text: 'III^', bold: true },{ text: 'IV^', bold: true },{ text: 'V', bold: true },{ text: 'Prove', bold: true }],
              [ 'Religione cattolica/Attività Alternative', '1', '1', '1','-' ],
              [ 'Scienze motorie sportive', '2', '2', '2','OP' ],
              [ 'Lingua e letteratura italiana', '4', '4', '4','SO' ],
              [ 'Storia', '2', '2', '2','O' ],
              [ 'Lingua straniera (Inglese)', '3', '3', '3','O' ],
              [ 'Matematica', '3', '3', '3','SO' ],
              [ 'Complementi di matematica', '1', '1', '-','SO' ],
              [ 'Informatica', '3 (3)', '3 (3)', '3 (3)','SOP' ],
              [ 'Sistemi e reti', '2 (2)', '2 (2)', '1 (3)','SOP' ],
              [ 'Tecnologie e progettazione di sistemi informatici e di telecomunicazioni', '2 (1)', '1 (2)', '1 (3)','GOP' ],
              [  `Gestione progetto, organizzazione d'impresa`, '-', '-', '2 (1)','SO' ],
              [ 'Telecomunicazioni', '1 (2)', '1 (2)', '-','SOP' ],
              [ 'Totale ore settimanali', '24 (8)', '23 (9)', '22 (10)','-' ]
            ]
          }},

          { text: `Presentazione della classe`, style: 'title'},

          { text: `▪ Composizione del Consiglio di Classe`, style: 'header' },
          {
            table: {
              headerRows: 1,
              widths: ['auto', 'auto', 'auto','auto'],
              body: tableConsiglioData,
            },
            pageBreak: 'after'
          },
          { text: `▪ Elenco allievi`, style: 'header' },
          { text: allieviFile },
          { text: `▪ Elenco candidati esterni`, style: 'header' },
          { text: esterniFile },
          { text: `▪ Storia della classe e continuità didattica nel triennio`, style: 'header' },
          { text: `Storia della classe`, bold: true },
          {
            table: {
              headerRows: 1,
              widths: ['auto', 'auto', 'auto','auto','auto'],
              body: tableStoriaData,
            },
            pageBreak: 'after'
          },
          { text: `Continuità dei docenti`, bold: true },
          { text: `La titolarità dei docenti delle singole materie di corso, nell‘arco dei tre anni, si riassume come segue.` },
          {
            table: {
              headerRows: 1,
              widths: ['auto', 'auto', 'auto','auto'],
              body: tableDocentiData,
            },
            pageBreak: 'after'
          },

          { text: `▪ Relazione sintetica`, style: 'header' },
          { text: relazioneFile },

          { text: `Indicazioni generali attività didattica e progetti`, style: 'title'},  

          { text: `▪ Attività di recupero o interventi di sostegno`, style: 'header' },
          { text: attivitarecuperoFile },
          { text: `▪ Percorsi per le competenze trasversali e l‟orientamento (PCTO)`, style: 'header' },
          { text: pctoFile },
          {
            table: {
              headerRows: 1,
              widths: ['auto', 'auto', 'auto','auto'],
              body: tableProgettiData,
            },
            pageBreak: 'after'
          },
          { text: `▪ CLIL: attività e modalità di insegnamento`, style: 'header' },
          { text: clilFile },
          { text: `▪ Attività e progetti attinenti a “Educazione civica”`, style: 'header' },
          { text: educazionecivicaFile },
          { text: `▪ Altre attività di arricchimento dell‟offerta formativa`, style: 'header' },
          { text: altreattivitaFile },
          { text: `▪ Attività aggiuntive pomeridiane previste dal PTOF d‟Istituto e progetto dal POF di classe`, style: 'header' },
          { text: ptofpofFile },
          { text: `▪ Eventuali attività specifiche di orientamento`, style: 'header' },
          { text: orientamentoFile },

          { text: `Criteri di valutazione`, style: 'title'},     

          { text: `▪ Criteri di valutazione nel triennio`, style: 'header' },
          { text: valutazioneFile },
          {
            table: {
              headerRows: 1,
              widths: [60, 'auto', 'auto'],
              body: tableVotiData,
            },
            pageBreak: 'after'
          },

          { text: `▪ Criteri di attribuzione crediti scolastici e formativi`, style: 'header' },
          { text: creditiFile },
          { text: 'TABELLA A', bold: true, alignment: 'center' },
          { text: 'CREDITO SCOLASTICO', bold: true, alignment: 'center' },
          {table: {
            headerRows: 1,
            widths: [ '*', '*', 100, '*' ],
    
            body: [
              [ { text: 'Media dei voti (Punti)', bold: true },{ text: 'I anno', bold: true },{ text: 'II anno', bold: true },{ text: 'III anno', bold: true }],
              [ 'M = 6', '7-8', '8-9', '9-10'],
              [ '6 < M ≤ 7', '8-9', '9-10', '10-11'],
              [ '7 < M ≤ 8', '9-10', '10-11', '11-12'],
              [ '8 < M ≤ 9', '10-11', '11-12', '13-14' ],
              [ '9 < M ≤ 10', '11-12', '12-13', '14-15'],
            ]
          },
          pageBreak: 'after'
          },

          { text: `Simulazione delle prove scritte`, style: 'title'},  
          { text: 'In accordo col Regolamento interno delle attività di preparazione all‘esame di Stato, discusso ed approvato dal Collegio dei docenti che ha recepito il Decreto Ministeriale del 20 novembre  2000, sono state programmate le attività di simulazione delle prove scritte come di seguito  indicato. '},

          { text: `▪ Simulazione delle prove scritte, date di svolgimento e criteri di valutazione`, style: 'header' },
          { text: simprovaScrittaFile },

          { text: `Criteri di valutazione per l'esame`, style: 'title'},     

          { text: `▪ Prima e seconda prova d'esame scritta`, style: 'header' },
          { text: provaEsamescrittoFile },

          { text: `▪ Prova d'esame orale`, style: 'header' },
          { text: provaEsameoraleFile },

          { text: 'Contributi delle singole discipline (Programmi disciplinari)', style: 'title'},          

          { text: '▪ Lingua e letteratura italiana', style: 'header' },
          { text: 'Relazione finale', style: 'header' },
          { text: relazionefinaleFileItaliano },
          { text: 'Programma svolto', style: 'header' },
          { text: programmasvoltoFileItaliano },

          { text: '▪ Storia', style: 'header' },
          { text: 'Relazione finale', style: 'header' },
          { text: relazionefinaleFileStoria },
          { text: 'Programma svolto', style: 'header' },
          { text: programmasvoltoFileStoria },

          { text: '▪ Inglese', style: 'header' },
          { text: 'Relazione finale', style: 'header' },
          { text: relazionefinaleFileInglese },
          { text: 'Programma svolto', style: 'header' },
          { text: programmasvoltoFileInglese },
          
          { text: '▪ Matematica', style: 'header' },
          { text: 'Relazione finale', style: 'header' },
          { text: relazionefinaleFileMatematica },
          { text: 'Programma svolto', style: 'header' },
          { text: programmasvoltoFileMatematica },

          { text: '▪ Informatica', style: 'header' },
          { text: 'Relazione finale', style: 'header' },
          { text: relazionefinaleFileInformatica },
          { text: 'Programma svolto', style: 'header' },
          { text: programmasvoltoFileInformatica },

          { text: '▪ Sistemi e reti', style: 'header' },
          { text: 'Relazione finale', style: 'header' },
          { text: relazionefinaleFileSistemi },
          { text: 'Programma svolto', style: 'header' },
          { text: programmasvoltoFileSistemi },

          { text: '▪ Tecnologie e progettazione di sistemi informatici e di telecomunicazioni', style: 'header' },
          { text: 'Relazione finale', style: 'header' },
          { text: relazionefinaleFileTpsit },
          { text: 'Programma svolto', style: 'header' },
          { text: programmasvoltoFileTpsit },

          { text: `▪ Gestione progetto, organizzazione d'impresa`, style: 'header' },
          { text: 'Relazione finale', style: 'header' },
          { text: relazionefinaleFileGpoi },
          { text: 'Programma svolto', style: 'header' },
          { text: programmasvoltoFileGpoi },

          { text: '▪ Scienze motorie sportive', style: 'header' },
          { text: 'Relazione finale', style: 'header' },
          { text: relazionefinaleFileGinnastica },
          { text: 'Programma svolto', style: 'header' },
          { text: programmasvoltoFileGinnastica },

          { text: '▪ Religione cattolica', style: 'header' },
          { text: 'Relazione finale', style: 'header' },
          { text: relazionefinaleFileReligione },
          { text: 'Programma svolto', style: 'header' },
          { text: programmasvoltoFileReligione },
        ],
        styles: {
          header: {
            fontSize: 14,
            bold: true,
            margin: [0, 10, 0, 5],
          },
          title: {
            fontSize: 20,
            bold: true,
            margin: [0, 10, 0, 5],
          },
        },
      };

      
      const pdfDoc = printer.createPdfKitDocument(docDefinition);
      const filePath = path.join(__dirname, `documento15maggio-incompleto.pdf`);
      
      pdfDoc.pipe(fs.createWriteStream(filePath));
      pdfDoc.end();
      
      readPDFfiles()

      socket.emit('filedownload_completo', { filename: `documento15maggio-incompleto.pdf` });


    })

    socket.on('merge', () => {
      mergeCompleto()
      socket.emit('filedownload_merge', { filename: `documento15maggio.pdf` })
      
    })

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
      });
})

async function mergeCompleto() {

  try {

    const existingPdfPath = 'documento15maggio-incompleto.pdf';
    const existingPdfBytes = fs.readFileSync(existingPdfPath);

    const mergedPdfPath = path.join(__dirname, 'Allegati', 'merged.pdf');
    const mergedPdfBytes = fs.readFileSync(mergedPdfPath);
    

    console.log('15 Head:', String(existingPdfBytes.subarray(0, 250)))
    console.log('Merge Head:', String(mergedPdfBytes.subarray(0, 250)))

    let existingPdfDoc;
    let mergedPdfDoc;

    try {
      existingPdfDoc = await PDFDocument.load(existingPdfBytes);
    } catch (error) {
      console.error('Failed to parse existing PDF document:', error);
      return;
    }

    try {
      mergedPdfDoc = await PDFDocument.load(mergedPdfBytes);
    } catch (error) {
      console.error('Failed to parse merged PDF document:', error);
      return;
    }

    const mergedPages = await existingPdfDoc.copyPages(mergedPdfDoc, mergedPdfDoc.getPageIndices());

    mergedPages.forEach((page) => {
      existingPdfDoc.addPage(page);
    });

    const modifiedPdfBytes = await existingPdfDoc.save();
    const filePath = path.join(__dirname, 'documento15maggio.pdf');
    fs.writeFileSync(filePath, modifiedPdfBytes);

    console.log('PDF files merged successfully.');
  } catch (error) {
    console.error('An error occurred during PDF merging:', error);
  }
}

async function readPDFfiles() {
  const folderPath = './Allegati';
  const files = fs.readdirSync(folderPath);
  const pdfFiles = files.filter(file => path.extname(file).toLowerCase() === '.pdf' && file !== 'merged.pdf');

  let mergedPdf;

  if (pdfFiles.length === 0) {
    mergedPdf = await PDFDocument.create();
  } else {
    const mergedPdfBytes = fs.readFileSync(path.join(folderPath, 'merged.pdf'));
    mergedPdf = await PDFDocument.load(mergedPdfBytes);
  }

  const times = await mergedPdf.registerFontkit(fontkit);

  const fontBytes = fs.readFileSync('node_modules/dejavu-fonts-ttf/ttf/DejaVuSans.ttf');
  const boldFontBytes = fs.readFileSync('node_modules/dejavu-fonts-ttf/ttf/DejaVuSans-Bold.ttf');

  const [font, boldFont] = await Promise.all([
    mergedPdf.embedFont(fontBytes, { fontkit }),
    mergedPdf.embedFont(boldFontBytes, { fontkit })
  ]);

  for (const file of pdfFiles) {
    const filePath = path.join(folderPath, file);
    const pdfBytes = fs.readFileSync(filePath);
    const pdf = await PDFDocument.load(pdfBytes);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach(page => mergedPdf.addPage(page));
  }

  const firstPage = mergedPdf.getPages()[0];
  const { width, height } = firstPage.getSize()

  const mergedPdfBytes = await mergedPdf.save();

  const outputPath = path.join(folderPath, 'merged.pdf');
  fs.writeFileSync(outputPath, mergedPdfBytes);

  console.log('I file PDF sono stati uniti con successo nel file merged.pdf');
}


function readDottedFiles(socket, myArray) {
  const filePrefixes = ['relazionefinale', 'programmasvolto'];

  if (Array.isArray(myArray)) {
    filePrefixes.forEach((prefix) => {
      myArray.forEach((item) => {
        const filename = `${prefix}_${item}.txt`;
        const filePath = path.join(__dirname, filename);
        const filePresence = fs.existsSync(filePath);

        if (filePresence) {
          const content = fs.readFileSync(filePath, 'utf8');
          const isEmpty = /^\s*$/.test(content);
          socket.emit('filepresence', { filename, isPresent: !isEmpty });
          console.log(filename, !isEmpty);
        } else {
          socket.emit('filepresence', { filename, isPresent: false });
        }
      });
    });
  } else {
    console.error('myArray is not an array');
  }
}

function formatTableData(tableData) {
  let formattedData = '';

  for (let row of tableData) {
    formattedData += row.join('\t') + '\n';
  }

  return formattedData;
}



function readFiles(socket) {
    fs.readdir(__dirname, (err, files) => {
      if (err) {
        console.error(err);
        return;
      }
  
      const textFiles = files.filter((file) => file.endsWith('.txt'));
  
      textFiles.forEach((file) => {
        const content = fs.readFileSync(file, 'utf8');
        const paragraphs = content.split('\n\n');
        const fileInfo = {
          filename: file,
          content: paragraphs,
        };
        socket.emit('filecontent', fileInfo);
      });
    });
  }

  

server.listen(3001, () => {
    console.log('server in esecuzione sulla porta 3001')
})