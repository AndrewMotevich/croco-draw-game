import {
  IGame,
  IPlayers,
  IRoom,
  UserStatus,
} from '@croco/../libs/croco-common-interfaces';
import * as WebSocket from 'ws';
import {
  IWebSocketGameServer,
  addServerAction,
  websocketServersReducer,
} from '../store/servers.store';

export function createNewGameServer(serverName: string, password: string) {
  const roomId = Date.now().toString();
  const gameServer: IWebSocketGameServer = {
    password: password,
    roomId: roomId,
    server: new WebSocket.Server({ noServer: true }),
    serverName: serverName,
  };

  gameServer.server.on('connection', (ws: WebSocket, request) => {
    ws.on('error', console.error);

    const { user_name } = request.headers;

    const room: IRoom = {
      roomId: roomId,
      serverName: serverName,
    };

    const players: IPlayers = {
      players: [
        {
          name: 'first',
          score: 0,
          ready: false,
          status: UserStatus.offline,
        },
      ],
    };
    const game: IGame = {
      gameQnt: 10,
      riddleWord: '',
      drawCache: [],
    };

    ws.on('message', () => {
      ws.send(`Room ${room.roomId}: ${JSON.stringify(room)}, ${user_name}`);
    });
  });

  websocketServersReducer(addServerAction(gameServer));

  return gameServer;
}
