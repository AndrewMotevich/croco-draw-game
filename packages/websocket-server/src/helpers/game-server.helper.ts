import {
  IGame,
  IPlayer,
  UserOrder,
} from '@croco/../libs/croco-common-interfaces';
import * as WebSocket from 'ws';

export function managePlayers(
  server: WebSocket.Server,
  players: { first?: IPlayer; second?: IPlayer },
  ws: WebSocket,
  myInfo: IPlayer,
  order: WeakSet<{ order: UserOrder }>,
  game: IGame
) {
  if (server.clients.size >= 3) {
    ws.close();
  } else if (server.clients.size === 2) {
    if (order.has(players.first)) {
      players.second = myInfo;
      myInfo.order = UserOrder.second;
      myInfo.ready = false;
      order.add(players.second);
    } else if (order.has(players.second)) {
      players.first = myInfo;
      myInfo.order = UserOrder.first;
      myInfo.ready = false;
      myInfo.host = !players.second.host;
      order.add({ order: UserOrder.first });
    }
  } else {
    players.first = myInfo;
    myInfo.order = UserOrder.first;
    myInfo.host = true;
    order.add(players.first);
    game.gameQnt = 0;
  }
}
