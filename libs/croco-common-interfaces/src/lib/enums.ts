export enum DrawTools {
  pen = 'pen',
  eraser = 'eraser',
  fill = 'fill',
  brush = 'brush',
}

export enum UserStatus {
  online = 'online',
  offline = 'offline',
}

export enum WebsocketRoomAction {
  createRoom = 'createRoom',
  connectToRoom = 'connectToRoom',
  deleteRoom = 'deleteRoom',
}

export enum WebSocketUserAction {
  ready = 'ready',
  riddleWord = 'riddleWord',
  draw = 'draw',
  nextStep = 'nextStep',
  answer = 'answer',
  getScore = 'getScore',
  newGame = 'newGame',
}
