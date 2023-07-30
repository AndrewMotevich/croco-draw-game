import { Injectable } from '@angular/core';
import { fromEvent } from 'rxjs';
import { map, switchMap, pairwise, takeUntil } from 'rxjs/operators';
import { WebsocketService } from './websocket.service';

@Injectable({
  providedIn: 'root',
})
export class DrawHostService {
  constructor(public websocketService: WebsocketService) {}

  public initCanvas() {
    const canvas = document.querySelector('canvas') as HTMLCanvasElement;

    const mouseOut$ = fromEvent(canvas, 'mouseout');

    const mouseUp$ = fromEvent(canvas, 'mouseup');

    const mouseMove$ = fromEvent(canvas, 'mousemove').pipe(
      map((event) => ({
        x: (event as MouseEvent).offsetX,
        y: (event as MouseEvent).offsetY,
      })),
      pairwise(),
      takeUntil(mouseOut$),
      takeUntil(mouseUp$)
    );

    const draw$ = fromEvent(canvas, 'mousedown').pipe(
      switchMap(() => mouseMove$),
      map(([from, to]) => ({ from, to }))
    );

    draw$.subscribe((res) => {
      const ctx = (canvas as HTMLCanvasElement).getContext('2d');
      ctx?.moveTo(res.from.x, res.from.y);
      ctx?.lineTo(res.to.x, res.to.y);
      ctx?.stroke();
    });
  }
}
