import express from 'express';
import url, { parse } from 'url';
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
import { authenticate } from '../helpers/authenticate.helper';

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
      ws.send(JSON.stringify({ message: `room ${serverId} was deleted` }));
    }
    if (parseObject.type === WebsocketServerAction.serverList) {
      WebsocketServersObservable.subscribe((servers) => {
        ws.send(JSON.stringify({ type: 'servers', servers: servers }));
      });
    }
  });

  ws.send(
    JSON.stringify({ message: 'You connected to main websocket server' })
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
        const { room_id, password } = url.parse(request.url, true).query;

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
