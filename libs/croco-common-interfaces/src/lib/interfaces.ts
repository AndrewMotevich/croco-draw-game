import { DrawTools } from './enums';

export interface IRoom {
  roomId: string;
  title: string;
  password: string;
  players: {
    first: { name: string; score: number; ready: boolean };
    second: { name: string; score: number; ready: boolean };
  };
}

export interface IGame {
  room: IRoom;
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
