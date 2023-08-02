import { IncomingMessage } from "http";

export function authenticate(
  request: IncomingMessage,
  nextCallback: (...args) => void
) {
  nextCallback();
}
