import { Injectable, OnInit } from '@angular/core';
import {
  IWebSocketGameServer,
  WebsocketServerAction,
} from '@croco/../libs/croco-common-interfaces';
import { environment } from '../../../environments/environment';
import { ReplaySubject, Subject, catchError, timeout } from 'rxjs';
import { webSocket } from 'rxjs/webSocket';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class WebsocketMainService {
  private mainWebSocket = webSocket({
    url: environment.mainServerPath,
    openObserver: {
      next: () => {
        this.onMainConnected$.next(true);
        this.mainWebSocket.next({ type: WebsocketServerAction.serverList });
      },
    },
  });

  public onMainConnected$ = new ReplaySubject<boolean>(1);
  public serverList$ = new Subject<IWebSocketGameServer[]>();
  public hostServerId$ = new Subject<string>();

  constructor(private router: Router) {
    this.mainWebSocket
      .pipe(
        timeout({ first: 4000 }),
        catchError(() => {
          this.onMainConnected$.next(false);
          this.router.navigate(['/error']);
          throw new Error();
        })
      )
      .subscribe({
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
