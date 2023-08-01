import express from 'express';
import { parse } from 'url';
import * as http from 'http';
import * as WebSocket from 'ws';
import { IMainServerMessage } from '@croco/../libs/croco-common-interfaces';
import { WebsocketServerAction } from '@croco/../libs/croco-common-interfaces';
import { createNewGameServer } from './game.server';
import {
  WebsocketServersObservable,
  removeServerAction,
  websocketServersReducer,
} from '../store/servers.store';
import { authenticate } from './authenticate';

const app = express();
export const server = http.createServer(app);
const mainWebsocketServer = new WebSocket.Server({
  noServer: true,
});

mainWebsocketServer.on('connection', (ws: WebSocket) => {
  ws.on('error', console.error);
  ws.on('message', (message: string) => {
    const parseMessage = Buffer.from(message, 'hex').toString('utf-8');
    const parseObject = JSON.parse(parseMessage) as IMainServerMessage;
    if (parseObject.type === WebsocketServerAction.createServer) {
      const { serverName, password } = parseObject.payload as {
        serverName: string;
        password: string;
      };
      const gameServer = createNewGameServer(serverName, password);
      ws.send(`{"roomId":"${gameServer.roomId}"}`);
    }
    if (parseObject.type === WebsocketServerAction.removeServer) {
      const serverId = (parseObject.payload as { serverId: string }).serverId;
      websocketServersReducer(removeServerAction({ serverId: serverId }));
      ws.send(`Server ${serverId} was deleted`);
    }
    if (parseObject.type === WebsocketServerAction.serverList) {
      WebsocketServersObservable.subscribe((servers) => {
        ws.send(JSON.stringify(servers));
      });
    }
  });

  ws.send(
    'You are connected to main Websocket server.\n Options: create, delete game room'
  );
});

server.on('upgrade', function upgrade(request, socket, head) {
  const { pathname } = parse(request.url, true);

  if (pathname === '/main') {
    mainWebsocketServer.handleUpgrade(request, socket, head, function done(ws) {
      mainWebsocketServer.emit('connection', ws, request);
    });
  } else if (pathname === `/room`) {
    WebsocketServersObservable.subscribe((servers) => {
      authenticate(request, function next() {
        const { room_id, password } = request.headers;
        const gameServer =
          servers.find((server) => server.roomId === room_id) || null;

        if (gameServer && gameServer.password === password) {
          gameServer.server.handleUpgrade(
            request,
            socket,
            head,
            function done(ws) {
              gameServer.server.emit('connection', ws, request);
            }
          );
        } else {
          socket.destroy();
        }
      });
    }).unsubscribe();
  } else {
    socket.destroy();
  }
});

// broadcast template

// mainWebsocketServer.clients.forEach((client) => {
//   client.send("message");
// });
