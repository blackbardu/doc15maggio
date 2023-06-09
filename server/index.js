const express = require('express')
const app = express()
const http = require('http')
const {Server} = require('socket.io')
const cors = require('cors')
const fs = require('fs')
const path = require('path');
const PdfPrinter = require('pdfmake');


app.use(cors())
const server = http.createServer(app)

app.get('/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, filename);
  
  res.download(filePath, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error downloading file');
    }
  });
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
              readFiles(socket);
            });
          }
        
    })

    socket.on('send_message_coordinatore', (data) => {
      const {filename, message, isChecked, selectedValue} = data
      console.log(`Nome file: ${filename}`);
      console.log(`Info: ${message}`);
      console.log(`Check: ${isChecked}`);
      console.log(`Titolo: ${selectedValue}`);

      var newFileName = "";

      switch(selectedValue)
      {
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
            io.emit('filecreato');
          });
        } else {
          fs.appendFile(newFileName, `\n${message}`, (err) => {
            if (err) {
              console.error(err);
              return;
            }
            console.log('Text file updated successfully.');
            io.emit('filecreato');
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

    readFiles(socket);
      

    socket.on('dotted_files', (myArray) =>{
      console.log(myArray.myArray)
      readDottedFiles(socket, myArray.myArray)

    })

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

    socket.on('save_table', ({ filename, message }) => {
      fs.writeFile(filename, message, (err) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log('File created successfully.');
        socket.emit('table_saved', { filename });
      });
    });

    socket.on('get_table', ({ filename }, callback) => {
      fs.readFile(filename, 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          callback({ success: false, data: [] });
        } else {
          const tableData = parseTableData(data);
          callback({ success: true, data: tableData });
        }
      });
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
      });
})


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