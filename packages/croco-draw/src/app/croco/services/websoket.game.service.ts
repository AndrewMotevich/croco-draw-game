import { Injectable } from '@angular/core';
import {
  GameMessagesType,
  IGameRoomMessage,
  IPlayer,
} from '@croco/../libs/croco-common-interfaces';
import { Observable, Subject, fromEvent } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebsocketGameService {
  private roomId = '';
  private password = '';
  private userName = '';

  private gameWebSocket!: WebSocket;
  private gameWebSocketObservable!: Observable<MessageEvent>;

  public players$ = new Subject<IPlayer[]>();

  public setCredentials(roomId: string, password: string, userName: string) {
    this.roomId = roomId;
    this.password = password;
    this.userName = userName;
  }

  public newGameConnection() {
    try {
      const params = `room_id=${this.roomId.toString()}&&password=${
        this.password
      }&&user_name=${this.userName}`;
      const url = new URL(`ws://localhost:8999/room?${params}`);
      this.gameWebSocket = new WebSocket(url);
      this.gameWebSocketObservable = fromEvent<MessageEvent>(
        this.gameWebSocket,
        'message'
      );
      this.gameWebSocketObservable.subscribe((message) => {
        const parsedMessage = JSON.parse(message.data) as IGameRoomMessage;
        if (parsedMessage.type === GameMessagesType.players) {
          this.players$.next(parsedMessage.payload as IPlayer[]);
        }
      });
      this.gameWebSocket.addEventListener('error', () => {
        alert('Wrong password');
      });
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  public getPlayers() {
    this.gameWebSocket.send(
      JSON.stringify({ type: GameMessagesType.getPlayers })
    );
  }
}
