import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { fromEvent, map, pairwise, switchMap, takeUntil } from 'rxjs';
import { DrawTools } from 'libs/croco-common-interfaces/src/lib/enums';
import {
  drawWithBrush,
  drawWithEraser,
  drawWithFloodFill,
  drawWithPen,
} from '../helpers/draw.helper';

@Directive({
  selector: 'canvas[crocoDrawHost]',
  standalone: true,
})
export class DrawHostDirective implements OnInit {
  @Input() public tool = DrawTools.pen;
  @Input() public color = '#000000';
  @Input() public range = 3;
  @Input() public clear = false;
  @Input() public save = false;

  constructor(private canvas: ElementRef) {}

  ngOnInit(): void {
    this.initCanvas();
  }

  private initCanvas() {
    const mouseOut$ = fromEvent(this.canvas.nativeElement, 'mouseout');

    const mouseUp$ = fromEvent(this.canvas.nativeElement, 'mouseup');

    const fill$ = fromEvent(this.canvas.nativeElement, 'mouseup').pipe(
      map((event) => ({
        x: (event as MouseEvent).offsetX,
        y: (event as MouseEvent).offsetY,
      }))
    );

    const mouseMove$ = fromEvent(this.canvas.nativeElement, 'mousemove').pipe(
      map((event) => ({
        x: (event as MouseEvent).offsetX,
        y: (event as MouseEvent).offsetY,
      })),
      pairwise(),
      takeUntil(mouseOut$),
      takeUntil(mouseUp$)
    );

    const draw$ = fromEvent(this.canvas.nativeElement, 'mousedown').pipe(
      switchMap(() => mouseMove$),
      map(([from, to]) => ({ from, to }))
    );

    draw$.subscribe((res) => {
      const ctx = this.canvas.nativeElement.getContext(
        '2d'
      ) as CanvasRenderingContext2D;
      if (this.tool === DrawTools.pen) {
        drawWithPen(ctx, res, this.color, this.range);
      } else if (this.tool === DrawTools.brush) {
        drawWithBrush(ctx, res, this.color, this.range);
      } else if (this.tool === DrawTools.eraser) {
        drawWithEraser(ctx, res, this.range);
      }
    });

    fill$.subscribe((res) => {
      const ctx = this.canvas.nativeElement.getContext(
        '2d'
      ) as CanvasRenderingContext2D;
      if (this.tool === DrawTools.fill) {
        drawWithFloodFill(ctx, res, this.color);
      }
    });
  }
}
