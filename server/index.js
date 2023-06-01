const express = require('express')
const app = express()
const http = require('http')
const {Server} = require('socket.io')
const cors = require('cors')
const fs = require('fs')
const db = require('./db');

app.use(cors())
const server = http.createServer(app)

app.get('/teachers', async (req, res) => {
  try {
    const teachers = await db('SELECT * FROM Insegnanti');
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ["GET", "POST"],
    },
}) 


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
              // Read the files and emit the content to all clients
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
              // Read the files and emit the content to all clients
              readFiles(socket);
            });
          }
        
    })

    socket.on('get_files', (pageName) => {
        

        readFiles(socket)

        if (typeof pageName === 'object' && pageName !== null) {
            // Check if pageName has the pageName property
            if (pageName.hasOwnProperty('pageName')) {
              // Extract and log the <string> value
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

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
      });
})

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