import { Injectable } from '@angular/core';
import { GameMessagesType } from '@croco/../libs/croco-common-interfaces';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private roomId = '';
  private password = '';
  private userName = '';

  private gameWebSocket!: WebSocket;

  public setCredentials(roomId: string, password: string, userName: string) {
    this.roomId = roomId;
    this.password = password;
    this.userName = userName;
  }

  public newGameConnection() {
    const url = new URL('ws://localhost:8999/room');
    url.searchParams.set('room_id', this.roomId);
    url.searchParams.set('password', this.password);
    url.searchParams.set('user_name', this.userName);
    this.gameWebSocket = new WebSocket('ws://localhost:8999/room');
  }

  public getPlayers() {
    this.gameWebSocket.send(
      JSON.stringify({ type: GameMessagesType.getPlayers })
    );
  }
}
