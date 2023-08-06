import { Directive, ElementRef, OnInit } from '@angular/core';
import { DrawTools } from 'libs/croco-common-interfaces/src/lib/enums';
import {
  drawWithBrush,
  drawWithEraser,
  drawWithFloodFill,
  drawWithPen,
} from '../helpers/draw.helper';
import { UntilDestroy } from '@ngneat/until-destroy';
import { WebsocketGameService } from '../services/websoket.game.service';

@UntilDestroy({ checkProperties: true })
@Directive({
  selector: 'canvas[crocoDrawClient]',
  standalone: true,
})
export class DrawClientDirective implements OnInit {
  constructor(
    private canvas: ElementRef,
    private gameWebsocketService: WebsocketGameService
  ) {}

  public ngOnInit(): void {
    this.initCanvas();
  }
  private initCanvas() {
    const draw$ = this.gameWebsocketService.drawMessages$;

    draw$.subscribe((message) => {
      const ctx = this.canvas.nativeElement.getContext(
        '2d'
      ) as CanvasRenderingContext2D;
      const { color, size: range, tool } = message.toolOptions;
      const coordinate = message.position || {
        from: { x: 0, y: 0 },
        to: { x: 0, y: 0 },
      };
      const mousePosition = message.fillCoordinate || { x: 0, y: 0 };
      if (tool === DrawTools.pen) {
        drawWithPen(ctx, coordinate, color, range);
      } else if (tool === DrawTools.brush) {
        drawWithBrush(ctx, coordinate, color, range);
      } else if (tool === DrawTools.eraser) {
        drawWithEraser(ctx, coordinate, range);
      } else if (tool === DrawTools.fill) {
        drawWithFloodFill(ctx, mousePosition, color);
      } else if (tool === DrawTools.clear) {
        ctx.clearRect(0, 0, 500, 500);
      }
    });
  }
}
