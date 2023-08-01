import * as WebSocket from 'ws';
import { managePlayers } from '../helpers/game-server.helper';
import {
  addServerAction,
  websocketServersReducer,
} from '../store/servers.store';
import {
  IGame,
  IGameRoomMessage,
  IPlayer,
  IWebSocketGameServer,
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
    managePlayers(gameServer.server, players, ws, myPlayerInfo, order);

    ws.on('error', console.error);
    ws.on('message', (message) => {
      const parsedMessage = JSON.parse(message.toString()) as IGameRoomMessage;
      const payload = parsedMessage.payload;
      switch (parsedMessage.type) {
        case WebSocketGameAction.getPlayers:
          ws.send(
            JSON.stringify({
              type: WebSocketGameAction.players,
              payload: players,
            })
          );
          break;

        case WebSocketGameAction.ready:
          myPlayerInfo.ready = true;
          if (players.first.ready && players.second.ready) {
            gameServer.server.clients.forEach((client) => {
              client.send(JSON.stringify({ type: WebSocketGameAction.start }));
            });
          } else ws.send(JSON.stringify({ type: WebSocketGameAction.pending }));
          break;

        case WebSocketGameAction.nextStep:
          if (game.gameQnt === 2) {
            gameServer.server.clients.forEach((client) => {
              client.send(
                JSON.stringify({ type: WebSocketGameAction.switchHost })
              );
            });
            game.gameQnt += 1;
          } else if (game.gameQnt === 5) {
            gameServer.server.clients.forEach((client) => {
              client.send(
                JSON.stringify({ type: WebSocketGameAction.results })
              );
            });
          } else {
            game.gameQnt += 1;
            gameServer.server.clients.forEach((client) => {
              client.send(JSON.stringify({ type: WebSocketGameAction.next }));
            });
          }
          break;

        case WebSocketGameAction.riddleWord:
          if (payload) {
            game.riddleWord = (payload as { riddleWord: string }).riddleWord;
          } else {
            ws.send(
              JSON.stringify({
                type: WebSocketGameAction.answer,
                payload: game.riddleWord,
              })
            );
          }
          break;

        case WebSocketGameAction.draw:
          gameServer.server.clients.forEach((client) => {
            client.send(message);
          });
          break;
      }
    });
  });

  websocketServersReducer(addServerAction(gameServer));

  return gameServer;
}
