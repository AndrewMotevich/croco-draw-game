export enum DrawTools {
  pen = 'pen',
  eraser = 'eraser',
  fill = 'fill',
  brush = 'brush',
  clear = 'clear',
}

export enum UserOrder {
  first = 'first',
  second = 'second',
}

export enum WebsocketServerAction {
  createServer = 'createServer',
  removeServer = 'removeServer',
  serverList = 'serverList',
  servers = 'servers',
}

export enum GameMessagesType {
  getPlayers = 'getPlayers',
  players = 'players',
  ready = 'ready',
  start = 'start',
  pending = 'pending',
  nextStep = 'nextStep',
  next = 'next',
  switchHost = 'switchHost',
  results = 'results',
  riddleWord = 'riddleWord',
  answer = 'answer',
  draw = 'draw',
  order = 'order',
  drawMessage = 'drawMessage',
}
