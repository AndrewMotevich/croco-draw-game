import {
  DrawTools,
  UserOrder,
  WebSocketGameAction,
  WebsocketServerAction,
} from './enums';

export interface IRoom {
  roomId: string;
  serverName: string;
}

export interface IPlayer {
  order: UserOrder | null;
  name: string;
  score: number;
  ready: boolean;
  host: boolean;
}

export interface IGame {
  gameQnt: number;
  riddleWord: string;
  drawCache: IDrawPayload[];
}

export interface IMainServerMessage {
  type: WebsocketServerAction;
  payload?: unknown;
}

export interface IGameRoomMessage {
  type: WebSocketGameAction;
  payload?: unknown;
}

export interface IDrawPayload {
  roomId: string;
  toolOptions: { tool: DrawTools; color: string; size: number };
  position: IMousePosition;
}

export interface IMousePosition {
  from: { x: number; y: number };
  to: { x: number; y: number };
}
