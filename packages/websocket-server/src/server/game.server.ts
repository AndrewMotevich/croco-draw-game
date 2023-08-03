import * as WebSocket from 'ws';
import url from 'url';
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
  GameMessagesType,
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
    const { user_name } = url.parse(request.url, true).query;
    const myPlayerInfo: IPlayer = {
      order: null,
      name: user_name.toString(),
      score: 0,
      ready: false,
      host: false,
    };
    managePlayers(gameServer.server, players, ws, myPlayerInfo, order, game);

    ws.on('error', (err) => {
      console.log(err);
    });
    ws.on('message', (message) => {
      const parsedMessage = JSON.parse(message.toString()) as IGameRoomMessage;
      const payload = parsedMessage.payload;
      switch (parsedMessage.type) {
        case GameMessagesType.getPlayers:
          ws.send(
            JSON.stringify({
              type: GameMessagesType.players,
              payload: players,
            })
          );
          break;

        case GameMessagesType.ready:
          myPlayerInfo.ready = true;
          if (players.first.ready && (players.second?.ready || false)) {
            gameServer.server.clients.forEach((client) => {
              client.send(JSON.stringify({ type: GameMessagesType.start }));
            });
          } else {
            gameServer.server.clients.forEach((client) => {
              client.send(
                JSON.stringify({
                  type: GameMessagesType.players,
                  payload: players,
                })
              );
            });
          }
          break;

        case GameMessagesType.nextStep:
          if (game.gameQnt === 2) {
            const success = (payload as { success: boolean }).success;
            players.first.host = !players.first.host;
            players.second.host = !players.second.host;
            gameServer.server.clients.forEach((client) => {
              client.send(
                JSON.stringify({ type: GameMessagesType.switchHost })
              );
            });
            if (success) myPlayerInfo.score += 1;
            game.gameQnt += 1;
          } else if (game.gameQnt === 5) {
            const success = (payload as { success: boolean }).success;
            if (success) myPlayerInfo.score += 1;
            gameServer.server.clients.forEach((client) => {
              players.first.ready = false;
              players.second.ready = false;
              client.send(JSON.stringify({ type: GameMessagesType.results }));
            });
          } else {
            const success = (payload as { success: boolean }).success;
            if (success) myPlayerInfo.score += 1;
            game.gameQnt += 1;
            gameServer.server.clients.forEach((client) => {
              client.send(JSON.stringify({ type: GameMessagesType.next }));
            });
          }
          break;

        case GameMessagesType.riddleWord:
          game.riddleWord = (payload as { riddleWord: string }).riddleWord;
          gameServer.server.clients.forEach((client) => {
            client.send(
              JSON.stringify({
                type: GameMessagesType.answer,
                payload: game.riddleWord,
              })
            );
          });
          break;

        case GameMessagesType.order:
          ws.send(
            JSON.stringify({
              type: 'myUserObject',
              myUserObject: myPlayerInfo,
            })
          );
          break;

        case GameMessagesType.draw:
          gameServer.server.clients.forEach((client) => {
            client.send(
              JSON.stringify({
                type: 'drawMessage',
                message: message.toString(),
              })
            );
          });
          break;
      }
    });
    ws.send(
      JSON.stringify({
        type: 'serverInfo',
        serverName: gameServer.serverName,
        serverId: gameServer.roomId,
        userOrder: myPlayerInfo.order,
      })
    );
    gameServer.server.clients.forEach((client) => {
      client.send(
        JSON.stringify({
          type: GameMessagesType.players,
          payload: players,
        })
      );
    });
  });

  websocketServersReducer(addServerAction(gameServer));

  return gameServer;
}
