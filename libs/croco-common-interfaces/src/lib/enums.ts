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

export enum WebsocketServerAction {
  createServer = 'createServer',
  removeServer = 'removeServer',
  serverList = 'serverList',
}

export enum WebSocketGameAction {
  connect = 'connect',
  ready = 'ready',
  riddleWord = 'riddleWord',
  draw = 'draw',
  nextStep = 'nextStep',
  answer = 'answer',
  getScore = 'getScore',
  newGame = 'newGame',
}
