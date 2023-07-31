import {
  DrawTools,
  UserStatus,
  WebSocketUserAction,
  WebsocketRoomAction,
} from './enums';

export interface IRoom {
  roomId: string;
  title: string;
  password: string;
  players: {
    first: { name: string; score: number; ready: boolean; status: UserStatus };
    second: { name: string; score: number; ready: boolean; status: UserStatus };
  };
  game: IGame;
}

export interface IGame {
  gameQnt: number;
  riddleWord: string;
}

export interface IMousePosition {
  from: { x: number; y: number };
  to: { x: number; y: number };
}

export interface IDrawMessage {
  roomId: string;
  toolOptions: { tool: DrawTools; color: string; size: number };
  position: IMousePosition;
}

export interface IMainWebsocketServerMessage {
  type: WebsocketRoomAction;
  payload: unknown;
}

export interface IGameRoomMessage {
  type: WebSocketUserAction;
  payload: unknown;
}
