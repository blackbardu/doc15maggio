const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ["GET", "POST"],
  },
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('send_message', (data) => {
    // ... resto del codice ...
  });

  socket.on('get_files', (pageName) => {
    const pagina = pageName.pageName || '';

    readFiles(socket, pagina);

    const dir = path.join(__dirname, 'documents');
    const filePrefixes = ['relazionefinale', 'programmasvolto'];

    filePrefixes.forEach((prefix) => {
      try {
        const files = fs.readdirSync(dir);

        createFiles(socket, prefix, pagina);

        files.forEach(() => {
          const filePath = path.join(dir, `${prefix}_${pagina}.txt`);
          fs.readFile(filePath, 'utf8', (err, content) => {
            if (err) {
              console.error(err);
              console.log('getfile');
              createFiles(socket, prefix, pagina);
              return;
            }
            const fileInfo = {
              filename: `${prefix}_${pagina}.txt`,
              content: content,
            };
            socket.emit('filecontent', fileInfo);
          });
        });
      } catch (err) {
        console.error(err);
        return;
      }
    });
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

function createFiles(socket, prefix, page) {
  const filePath = path.join(__dirname, 'documents', `${prefix}_${page}.txt`);
  fs.appendFile(filePath, '', (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('New text file empty created successfully.');
    io.emit('filecreato');
    // Read the files and emit the content to all clients
    readFiles(socket);
  });
}

function readFiles(socket, pageName) {
  const dir = path.join(__dirname, 'documents');
  console.log(dir);

  const filePrefixes = ['relazionefinale', 'programmasvolto'];
  filePrefixes.forEach((prefix) => {
    const filePath = path.join(dir, `${prefix}_${pageName}.txt`);
    fs.readFile(filePath, 'utf8', (err, content) => {
      if (err) {
        console.error(err);
        console.log('fileprefixes');
        createFiles(socket, prefix, pageName);
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

server.listen(3001, () => {
  console.log('Server in esecuzione sulla porta 3001');
});
