export enum DrawTools {
  pen = 'pen',
  eraser = 'eraser',
  fill = 'fill',
  brush = 'brush',
}

export enum UserOrder {
  first = 'first',
  second = 'second',
}

export enum WebsocketServerAction {
  createServer = 'createServer',
  removeServer = 'removeServer',
  serverList = 'serverList',
}

export enum WebSocketGameAction {
  players = 'players',
  ready = 'ready',
  start = 'start',
  pending = 'pending',
  nextStep = 'nextStep',
  riddleWord = 'riddleWord',
  draw = 'draw',
}
