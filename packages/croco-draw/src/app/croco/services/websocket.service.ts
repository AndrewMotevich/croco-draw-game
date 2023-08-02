import { Injectable } from '@angular/core';
import {
  GameMessagesType,
  IWebSocketGameServer,
  WebsocketServerAction,
} from '@croco/../libs/croco-common-interfaces';
import { Subject, fromEvent } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private mainWebSocket = new WebSocket('ws://localhost:8999/main');

  private roomId = '';
  private password = '';
  private userName = '';

  private gameWebSocket!: WebSocket;
  private mainWebsocketMessageObservable$ = fromEvent<MessageEvent>(
    this.mainWebSocket,
    'message'
  );

  public serverList$ = new Subject();

  constructor() {
    this.mainWebsocketMessageObservable$.subscribe((message) => {
      const parsedMessage = JSON.parse(message.data);
      console.log(parsedMessage);
      if (
        (parsedMessage as { type: string; servers: IWebSocketGameServer[] })
          .type === 'servers'
      ) {
        const payload = (
          parsedMessage as { type: string; servers: IWebSocketGameServer[] }
        ).servers;
        this.serverList$.next(payload);
      }
    });
    this.mainWebSocket.addEventListener('open', () => {
      this.mainWebSocket.send(
        JSON.stringify({ type: WebsocketServerAction.serverList })
      );
    });
  }

  public getServerList() {
    const message = { type: WebsocketServerAction.serverList };
    this.mainWebSocket.send(JSON.stringify(message));
  }

  public createServer(password: string, serverName: string) {
    const message = {
      type: WebsocketServerAction.createServer,
      payload: { password, serverName },
    };
    this.mainWebSocket.send(JSON.stringify(message));
  }

  public removeServer(serverId: string) {
    const message = {
      type: WebsocketServerAction.removeServer,
      payload: { serverId },
    };
    this.mainWebSocket.send(JSON.stringify(message));
  }

  // public newGameConnection(roomId: string, password: string, userName: string) {
  //   this.roomId = roomId;
  //   this.password = password;
  //   this.userName = userName;
  //   this.gameWebSocket = new WebSocket('ws://localhost:8999/room', {
  //     headers: {
  //       room_id: this.roomId,
  //       password: this.password,
  //       user_name: this.userName,
  //     },
  //   });
  //   this.gameWebSocket.on('error', console.error);
  //   this.gameWebSocket.on('message', function message(data) {
  //     console.log('Game server received: %s', data);
  //   });
  //   return this.gameWebSocket;
  // }

  // public getPlayers() {
  //   this.gameWebSocket.send(
  //     JSON.stringify({ type: GameMessagesType.getPlayers })
  //   );
  // }
}
