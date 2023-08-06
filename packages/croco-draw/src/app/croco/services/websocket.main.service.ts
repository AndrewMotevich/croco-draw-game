import { Injectable } from '@angular/core';
import {
  IWebSocketGameServer,
  WebsocketServerAction,
} from '@croco/../libs/croco-common-interfaces';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Subject, tap } from 'rxjs';
import { webSocket } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root',
})
export class WebsocketMainService {
  private mainWebSocket = webSocket({
    url: environment.mainServerPath,
    openObserver: {
      next: () => {
        console.log('next');
        this.onMainConnect$.next(true);
        this.mainWebSocket.next({ type: WebsocketServerAction.serverList });
      },
    },
  });

  public onMainConnect$ = new BehaviorSubject<boolean>(false);
  public serverList$ = new Subject<IWebSocketGameServer[]>();
  public hostServerId$ = new Subject<string>();

  constructor() {
    this.mainWebSocket.subscribe({
      next: (message) => {
        console.log(message);
        if (
          (message as { type: string; servers: IWebSocketGameServer[] })
            .type === 'servers'
        ) {
          const payload = (
            message as { type: string; servers: IWebSocketGameServer[] }
          ).servers;
          this.serverList$.next(payload);
        }
        if ((message as { roomId: string }).roomId) {
          this.hostServerId$.next((message as { roomId: string }).roomId);
        }
      },
      error: () => {
        this.onMainConnect$.next(false);
      },
    });
  }

  public getServerList() {
    const message = { type: WebsocketServerAction.serverList };
    this.mainWebSocket.next(message);
  }

  public createServer(password: string, serverName: string) {
    const message = {
      type: WebsocketServerAction.createServer,
      payload: { password, serverName },
    };
    this.mainWebSocket.next(message);
  }

  public removeServer(serverId: string) {
    const message = {
      type: WebsocketServerAction.removeServer,
      payload: { serverId },
    };
    this.mainWebSocket.next(message);
  }
}
