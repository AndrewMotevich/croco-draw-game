import { Injectable } from '@angular/core';
import {
  IWebSocketGameServer,
  WebsocketServerAction,
} from '@croco/../libs/croco-common-interfaces';
import { Subject, fromEvent } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebsocketMainService {
  private mainWebSocket = new WebSocket('ws://localhost:8999/main');

  private mainWebsocketMessageObservable$ = fromEvent<MessageEvent>(
    this.mainWebSocket,
    'message'
  );

  public serverList$ = new Subject<IWebSocketGameServer[]>();
  public hostServerId$ = new Subject<string>();

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
      if ((parsedMessage as { roomId: string }).roomId) {
        this.hostServerId$.next((parsedMessage as { roomId: string }).roomId);
      }
    });
    this.mainWebSocket.addEventListener('open', () => {
      this.mainWebSocket.send(
        JSON.stringify({ type: WebsocketServerAction.serverList })
      );
    });
    this.mainWebSocket.addEventListener('error', () => {
      alert('Failed connect to main server.\nTry to reload or visit later');
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
}
