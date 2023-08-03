import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  DrawTools,
  GameMessagesType,
  IGameRoomMessage,
  IMousePosition,
  IPlayer,
} from '@croco/../libs/croco-common-interfaces';
import { Observable, fromEvent, BehaviorSubject, Subject } from 'rxjs';
import { IDrawMessage } from '../../../../../../dist/libs/croco-common-interfaces/src/lib/interfaces';

@Injectable({
  providedIn: 'root',
})
export class WebsocketGameService {
  private roomId = '';
  private password = '';
  private userName = '';

  private gameWebSocket!: WebSocket;
  private messageObservable$!: Observable<MessageEvent>;
  private errorObservable$!: Observable<MessageEvent>;

  public serverName$ = new BehaviorSubject<string>('');
  public serverId$ = new BehaviorSubject<string>('');

  public myUserObject$ = new Subject<IPlayer>();
  public drawMessages$ = new Subject<IDrawMessage>();
  public players$ = new BehaviorSubject<IPlayer[]>([]);
  public answer$ = new BehaviorSubject<string>('');

  public onConnected$ = new BehaviorSubject<boolean>(false);
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
    const url = new URL(`ws://localhost:8999/room?${params}`);
    const newServer = new WebSocket(url);
    this.gameWebSocket = newServer;
    this.messageObservable$ = fromEvent<MessageEvent>(newServer, 'message');
    this.errorObservable$ = fromEvent<MessageEvent>(newServer, 'error');
    this.messageObservable$.subscribe((message) => {
      const parsedMessage = JSON.parse(message.data) as IGameRoomMessage;
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
      if (JSON.parse(message.data).type === 'serverInfo') {
        this.serverName$.next(JSON.parse(message.data).serverName);
        this.serverId$.next(JSON.parse(message.data).serverId);
        this.results$.next(false);
        this.onConnected$.next(true);
        this.router.navigate(['/room']);
      }
      if (JSON.parse(message.data).type === 'myUserObject') {
        this.myUserObject$.next(JSON.parse(message.data).myUserObject);
      }
      if (JSON.parse(message.data).type === 'drawMessage') {
        const drawMessage = JSON.parse(message.data).message;
        this.drawMessages$.next(JSON.parse(drawMessage).payload);
      }
    });
    this.errorObservable$.subscribe(() => {
      this.onConnected$.next(false);
    });
  }

  public getPlayers() {
    this.onConnected$.subscribe((value) => {
      if (value) {
        this.gameWebSocket.send(
          JSON.stringify({ type: GameMessagesType.getPlayers })
        );
        this.gameWebSocket.send(
          JSON.stringify({ type: GameMessagesType.order })
        );
      }
    });
  }

  public myUserObject() {
    this.gameWebSocket.send(JSON.stringify({ type: GameMessagesType.order }));
  }

  public readyToGame() {
    this.gameWebSocket.send(JSON.stringify({ type: GameMessagesType.ready }));
  }

  public nextStep() {
    this.gameWebSocket.send(
      JSON.stringify({ type: GameMessagesType.nextStep })
    );
  }

  public setRiddleWord(riddleWord: string) {
    this.gameWebSocket.send(
      JSON.stringify({
        type: GameMessagesType.riddleWord,
        payload: { riddleWord: riddleWord },
      })
    );
  }

  public sendDrawMessage(
    color: string,
    size: number,
    tool: DrawTools,
    coordinate: IMousePosition
  ) {
    const drawMessage: { type: GameMessagesType; payload: IDrawMessage } = {
      type: GameMessagesType.draw,
      payload: { toolOptions: { color, size, tool }, coordinate },
    };
    this.gameWebSocket.send(JSON.stringify(drawMessage));
  }

  public sendFillMessage(
    color: string,
    size: number,
    mousePosition: { x: number; y: number }
  ) {
    const drawMessage: { type: GameMessagesType; payload: IDrawMessage } = {
      type: GameMessagesType.draw,
      payload: {
        toolOptions: { color, size, tool: DrawTools.fill },
        mousePosition,
      },
    };
    this.gameWebSocket.send(JSON.stringify(drawMessage));
  }
}
