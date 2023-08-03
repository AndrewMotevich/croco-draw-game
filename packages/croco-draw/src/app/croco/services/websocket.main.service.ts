import { Injectable } from '@angular/core';
import {
  IWebSocketGameServer,
  WebsocketServerAction,
} from '@croco/../libs/croco-common-interfaces';
import { environment } from 'packages/croco-draw/src/environments/environment';
import { BehaviorSubject, Subject, fromEvent } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebsocketMainService {
  private mainWebSocket = new WebSocket(environment.mainServerPath);

  private mainWebsocketMessageObservable$ = fromEvent<MessageEvent>(
    this.mainWebSocket,
    'message'
  );

  public onMainConnect$ = new BehaviorSubject<boolean>(false);
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
      this.onMainConnect$.next(true);
      this.mainWebSocket.send(
        JSON.stringify({ type: WebsocketServerAction.serverList })
      );
    });
    this.mainWebSocket.addEventListener('error', () => {
      this.onMainConnect$.next(false);
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
