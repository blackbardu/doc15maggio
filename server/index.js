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