import * as WebSocket from 'ws';
import {
  DrawTools,
  UserOrder,
  GameMessagesType,
  WebsocketServerAction,
} from './enums';

export interface IWebSocketGameServer {
  roomId: string;
  serverName: string;
  password: string;
  server: WebSocket.Server;
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
  servers?: IWebSocketGameServer[];
  roomId?: string;
}

export interface IGameRoomMessage {
  type: GameMessagesType;
  payload?: unknown;
}

export interface IDrawPayload {
  toolOptions: { tool: DrawTools; color: string; size: number };
  position?: IMousePosition;
  fillCoordinate?: { x: number; y: number };
}

export interface IMousePosition {
  from: { x: number; y: number };
  to: { x: number; y: number };
}
