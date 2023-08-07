import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  DrawTools,
  GameMessagesType,
  IGameRoomMessage,
  IMousePosition,
  IPlayer,
} from '@croco/../libs/croco-common-interfaces';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { IDrawPayload } from '@croco/../libs/croco-common-interfaces';
import { environment } from '../../../environments/environment';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root',
})
export class WebsocketGameService {
  private roomId = '';
  private password = '';
  private userName = '';

  private gameWebSocket!: WebSocketSubject<IGameRoomMessage>;

  public serverName$ = new BehaviorSubject<string>('');
  public serverId$ = new BehaviorSubject<string>('');

  public myUserObject$ = new Subject<IPlayer>();
  public drawMessages$ = new Subject<IDrawPayload>();
  public players$ = new BehaviorSubject<IPlayer[]>([]);
  public answer$ = new BehaviorSubject<string>('');

  public onGameConnected$ = new ReplaySubject<boolean>();
  public startGame$ = new BehaviorSubject<boolean>(false);
  public results$ = new BehaviorSubject<boolean>(false);
  public switchHost$ = new BehaviorSubject<boolean>(false);
  public next$ = new BehaviorSubject<boolean>(false);

  constructor(private router: Router) {}

  public setCredentials(roomId: string, password: string, userName: string) {
    this.roomId = roomId;
    this.password = password;
    this.userName = userName;
  }

  public newGameConnection() {
    const params = new URLSearchParams();
    params.append('room_id', this.roomId.toString());
    params.append('password', this.password);
    params.append('user_name', this.userName);
    const url = new URL(
      environment.gameServerPath + params.toString()
    ).toString();

    this.gameWebSocket = webSocket<IGameRoomMessage>({
      url,
      openObserver: {
        next: () => {
          this.onGameConnected$.next(true);
        },
      },
    });

    this.gameWebSocket.subscribe({
      next: (message) => {
        console.log('game server', message);
        // message broker
        if (message.type === GameMessagesType.players) {
          this.players$.next(
            Object.values(message.payload as { [key: string]: IPlayer })
          );
        }
        if (message.type === GameMessagesType.results) {
          this.results$.next(true);
        }
        if (message.type === GameMessagesType.switchHost) {
          this.switchHost$.next(true);
        }
        if (message.type === GameMessagesType.next) {
          this.next$.next(true);
        }
        if (message.type === GameMessagesType.start) {
          this.startGame$.next(true);
        }
        if (message.type === GameMessagesType.answer) {
          this.answer$.next(message.payload as string);
        }
        if (message.type === GameMessagesType.serverInfo) {
          this.serverName$.next(message.serverName || '');
          this.serverId$.next(message.serverId || '');
          this.results$.next(false);
          this.router.navigate(['/room']);
        }
        if (message.type === GameMessagesType.myUserObject) {
          this.myUserObject$.next(
            (message as { myUserObject: IPlayer }).myUserObject
          );
        }
        if (message.type === GameMessagesType.drawMessage) {
          const drawMessage = (message as { message: string }).message;
          this.drawMessages$.next(JSON.parse(drawMessage).payload);
        }
      },
      error: () => {
        this.onGameConnected$.next(false);
      },
    });
  }

  public getPlayers() {
    this.onGameConnected$.subscribe((value) => {
      if (value) {
        this.gameWebSocket.next({ type: GameMessagesType.getPlayers });
        this.gameWebSocket.next({ type: GameMessagesType.order });
      }
    });
  }

  public myUserObject() {
    this.gameWebSocket.next({ type: GameMessagesType.order });
  }

  public readyToGame() {
    this.gameWebSocket.next({ type: GameMessagesType.ready });
  }

  public nextStep(success: boolean) {
    this.gameWebSocket.next({
      type: GameMessagesType.nextStep,
      payload: { success },
    });
  }

  public setRiddleWord(riddleWord: string) {
    this.gameWebSocket.next({
      type: GameMessagesType.riddleWord,
      payload: { riddleWord: riddleWord },
    });
  }

  public sendDrawMessage(
    color: string,
    size: number,
    tool: DrawTools,
    coordinate: IMousePosition
  ) {
    const drawMessage: { type: GameMessagesType; payload: IDrawPayload } = {
      type: GameMessagesType.draw,
      payload: { toolOptions: { color, size, tool }, position: coordinate },
    };
    this.gameWebSocket.next(drawMessage);
  }

  public sendFillMessage(
    color: string,
    size: number,
    mousePosition: { x: number; y: number }
  ) {
    const drawMessage: { type: GameMessagesType; payload: IDrawPayload } = {
      type: GameMessagesType.draw,
      payload: {
        toolOptions: { color, size, tool: DrawTools.fill },
        fillCoordinate: mousePosition,
      },
    };
    this.gameWebSocket.next(drawMessage);
  }
}
