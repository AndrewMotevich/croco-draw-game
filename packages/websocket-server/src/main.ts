import express from 'express';
import { parse } from 'url';
import * as http from 'http';
import * as WebSocket from 'ws';
import {
  IMainWebsocketServerMessage,
  IRoom,
} from '@croco/../libs/croco-common-interfaces';
import {
  UserStatus,
  WebsocketRoomAction,
} from '@croco/../libs/croco-common-interfaces';

const app = express();
const server = http.createServer(app);
const mainWebsocketServer = new WebSocket.Server({
  noServer: true,
});

const Rooms: IRoom[] = [];
const WebsocketServers: { roomId: string; server: WebSocket.Server }[] = [];

mainWebsocketServer.on('connection', (ws: WebSocket) => {
  ws.on('message', (message: string) => {
    const parseMessage = Buffer.from(message, 'hex').toString('utf-8');
    const parseObject = JSON.parse(parseMessage) as IMainWebsocketServerMessage;
    if (parseObject.type === WebsocketRoomAction.createRoom) {
      createNewRoom();
      ws.send(JSON.stringify(Rooms));
    }
  });

  ws.send(
    'You are connected to main Websocket server.\n Options: create, delete game room'
  );
});

function createNewRoom() {
  const room: IRoom = {
    roomId: Date.now().toString(),
    title: 'Room' + Date.now(),
    password: 'qwerty123',
    players: {
      first: {
        name: 'first',
        score: 0,
        ready: false,
        status: UserStatus.offline,
      },
      second: {
        name: 'second',
        score: 0,
        ready: false,
        status: UserStatus.online,
      },
    },
    game: {
      gameQnt: 10,
      riddleWord: '',
    },
  };

  const wss = new WebSocket.Server({ noServer: true });

  wss.on('connection', (ws: WebSocket) => {
    ws.on('message', (message) => {
      ws.send(`Room ${room.roomId}: ${message}`);
    });
  });

  Rooms.push(room);
  WebsocketServers.push({ roomId: room.roomId, server: wss });
}

server.on('upgrade', function upgrade(request, socket, head) {
  const { pathname, search } = parse(request.url, true);
  const parseRoomId =
    search?.split('=')[0] === '?roomId' ? search.split('=')[1] : '';

  if (pathname === '/main') {
    mainWebsocketServer.handleUpgrade(request, socket, head, function done(ws) {
      mainWebsocketServer.emit('connection', ws, request);
    });
  } else if (pathname === `/room` && WebsocketServers.length) {
    const room = WebsocketServers.find((room) => room.roomId === parseRoomId);
    if (room) {
      room.server.handleUpgrade(request, socket, head, function done(ws) {
        room.server.emit('connection', ws, request);
      });
    }
  } else {
    socket.destroy();
  }
});

server.listen(process.env.PORT || 8999, () => {
  console.log(`Server started on port 8999 :)`);
});

// broadcast template

// mainWebsocketServer.clients.forEach((client) => {
//   client.send("message");
// });
