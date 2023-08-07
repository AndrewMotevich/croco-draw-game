import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  DrawTools,
  GameMessagesType,
  IGameRoomMessage,
  IMousePosition,
  IPlayer,
} from '@croco/../libs/croco-common-interfaces';
import { BehaviorSubject, Subject } from 'rxjs';
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

  private gameWebSocket!: WebSocketSubject<unknown>;

  public serverName$ = new BehaviorSubject<string>('');
  public serverId$ = new BehaviorSubject<string>('');

  public myUserObject$ = new Subject<IPlayer>();
  public drawMessages$ = new Subject<IDrawPayload>();
  public players$ = new BehaviorSubject<IPlayer[]>([]);
  public answer$ = new BehaviorSubject<string>('');

  public onGameConnected$ = new Subject<boolean>();
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
    const params = `room_id=${this.roomId.toString()}&&password=${
      this.password
    }&&user_name=${this.userName}`;
    const url = new URL(environment.gameServerPath + params).toString();

    this.gameWebSocket = webSocket({
      url,
      openObserver: {
        next: () => {
          this.onGameConnected$.next(true);
        },
      },
    });

    this.gameWebSocket.subscribe({
      next: (message) => {
        const parsedMessage = message as IGameRoomMessage;
        // message broker
        console.log('game server', parsedMessage);
        if (parsedMessage.type === GameMessagesType.players) {
          this.players$.next(
            Object.values(parsedMessage.payload as { [key: string]: IPlayer })
          );
        }
        if (parsedMessage.type === GameMessagesType.results) {
          this.results$.next(true);
        }
        if (parsedMessage.type === GameMessagesType.switchHost) {
          this.switchHost$.next(true);
        }
        if (parsedMessage.type === GameMessagesType.next) {
          this.next$.next(true);
        }
        if (parsedMessage.type === GameMessagesType.start) {
          this.startGame$.next(true);
        }
        if (parsedMessage.type === GameMessagesType.answer) {
          this.answer$.next(parsedMessage.payload as string);
        }
        if ((message as { type: string }).type === 'serverInfo') {
          this.serverName$.next((message as { serverName: string }).serverName);
          this.serverId$.next((message as { serverId: string }).serverId);
          this.results$.next(false);
          this.router.navigate(['/room']);
        }
        if ((message as { type: string }).type === 'myUserObject') {
          this.myUserObject$.next(
            (message as { myUserObject: IPlayer }).myUserObject
          );
        }
        if ((message as { type: string }).type === 'drawMessage') {
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
