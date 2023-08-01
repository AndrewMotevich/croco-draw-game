import * as WebSocket from 'ws';
import { managePlayers } from '../helpers/game-server.helper';
import {
  IWebSocketGameServer,
  addServerAction,
  websocketServersReducer,
} from '../store/servers.store';
import {
  IGame,
  IGameRoomMessage,
  IPlayer,
  IRoom,
  WebSocketGameAction,
} from '@croco/../libs/croco-common-interfaces';

export function createNewGameServer(serverName: string, password: string) {
  const roomId = Date.now().toString();
  const gameServer: IWebSocketGameServer = {
    password: password,
    roomId: roomId,
    server: new WebSocket.Server({ noServer: true }),
    serverName: serverName,
  };
  const room: IRoom = {
    roomId: roomId,
    serverName: serverName,
  };
  const players: { first?: IPlayer; second?: IPlayer } = {};
  const game: IGame = {
    gameQnt: 0,
    riddleWord: '',
    drawCache: [],
  };
  const order: WeakSet<IPlayer> = new WeakSet();

  gameServer.server.on('connection', (ws: WebSocket, request) => {
    const { user_name } = request.headers;
    const myPlayerInfo: IPlayer = {
      order: null,
      name: user_name.toString(),
      score: 0,
      ready: false,
      host: false,
    };
    managePlayers(
      gameServer.server,
      players,
      user_name.toString(),
      ws,
      myPlayerInfo,
      order
    );

    ws.on('error', console.error);
    ws.on('message', (message) => {
      const parsedMessage = JSON.parse(message.toString()) as IGameRoomMessage;
      switch (parsedMessage.type) {
        case WebSocketGameAction.players:
          ws.send(JSON.stringify(players));
          break;
        case WebSocketGameAction.ready:
          myPlayerInfo.ready = true;
          if (players.first.ready && players.second.ready) {
            gameServer.server.clients.forEach(() => {
              ws.send(JSON.stringify({ type: WebSocketGameAction.start }));
            });
          } else ws.send(JSON.stringify({ type: WebSocketGameAction.pending }));
          break;
        case WebSocketGameAction.nextStep:
          break;
        case WebSocketGameAction.riddleWord:
          break;
        case WebSocketGameAction.draw:
          break;
      }
    });
  });

  websocketServersReducer(addServerAction(gameServer));

  return gameServer;
}
