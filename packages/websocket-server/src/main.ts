import express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';

const app = express();

//initialize a simple http server
const server = http.createServer(app);

//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws: WebSocket) => {
  //connection is up, let's add a simple simple event
  ws.on('message', (message: string) => {
    //log the received message and send it back to the client
    console.log('received: %s', message);
    wss.clients.forEach((client) => {
      client.send(`${message}`);
    });
  });

  //send immediatly a feedback to the incoming connection
  ws.send('{"from": {"x": 0, "y": 0}, "to": {"x": 0, "y": 0}}');
});

//start our server
server.listen(process.env.PORT || 8999, () => {
  console.log(`Server started on port 8999 :)`);
});
