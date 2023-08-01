import * as WebSocket from 'ws';
import { BehaviorSubject } from 'rxjs';

export interface IWebSocketGameServer {
  roomId: string;
  serverName: string;
  password: string;
  server: WebSocket.Server;
}
//store
let WebsocketServers: IWebSocketGameServer[] = [];
export const WebsocketServersObservable: BehaviorSubject<
  IWebSocketGameServer[]
> = new BehaviorSubject([]);

//actions
export const addServerAction = (payload: IWebSocketGameServer) => ({
  type: '[WebsocketServers] add new game server',
  payload,
});
export const removeServerAction = (payload: { serverId: string }) => ({
  type: '[WebsocketServers] remove game server',
  payload,
});

//reducers
export const websocketServersReducer = (action: {
  type: string;
  payload: unknown;
}) => {
  if (action.type === '[WebsocketServers] add new game server') {
    WebsocketServers.push(action.payload as IWebSocketGameServer);
    WebsocketServersObservable.next(WebsocketServers);
  } else if (action.type === '[WebsocketServers] remove game server') {
    const filteredServers = WebsocketServers.filter(
      (server) =>
        server.roomId !== (action.payload as { serverId: string }).serverId
    );
    WebsocketServers = filteredServers;
    WebsocketServersObservable.next(filteredServers);
  }
};
