import {
  DrawTools,
  UserStatus,
  WebSocketGameAction,
  WebsocketServerAction,
} from './enums';

export interface IRoom {
  roomId: string;
  serverName: string;
}

export interface IPlayers {
  players: {
    name: string;
    score: number;
    ready: boolean;
    status: UserStatus;
  }[];
}

export interface IGame {
  gameQnt: number;
  riddleWord: string;
  drawCache: IDrawMessage[];
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

export interface IMainServerMessage {
  type: WebsocketServerAction;
  payload?: unknown;
}

export interface IGameRoomMessage {
  type: WebSocketGameAction;
  payload: unknown;
}
