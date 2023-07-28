import { DrawTools } from './enums';

export interface IRoom {
  roomId: string;
  title: string;
  players: {
    first: { name: string; score: number; ready: boolean };
    second: { name: string; score: number; ready: boolean };
  };
}

export interface IGame {
  room: IRoom;
  gameQnt: number;
  crocoWord: string;
}

export interface IMousePosition {
  from: { x: number; y: number };
  to: { x: number; y: number };
}

export interface IDrawMessages {
  roomId: string;
  toolOptions: { tool: DrawTools; color: string; size: number };
  position: IMousePosition;
}
