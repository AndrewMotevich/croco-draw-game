import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { markAsDirty } from '../../utils/markAsDirty';
import { ConfirmationService } from 'primeng/api';
import { generateErrorExpression } from '../../utils/generateErrorExpression';
import { DrawTools } from 'libs/croco-common-interfaces/src/lib/enums';
import { clearCanvas, saveCanvas } from '../../helpers/draw.helper';
import { WebsocketGameService } from '../../services/websoket.game.service';
import { Router } from '@angular/router';

@Component({
  selector: 'croco-paint-panel',
  templateUrl: './paint-panel.component.html',
  styleUrls: ['./paint-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
})
export class PaintPanelComponent implements OnInit {
  public errorExpression = generateErrorExpression;

  public showCanvas = false;

  public riddleWord!: string;

  public activeIcon: [string, { tool: DrawTools }] = [
    'pi pi-pencil',
    { tool: DrawTools.pen },
  ];

  public items = [
    {
      icon: 'fa-solid fa-fill',
      command: () => {
        this.activeIcon = ['fa-solid fa-fill', { tool: DrawTools.fill }];
      },
    },
    {
      icon: 'pi pi-eraser',
      command: () => {
        this.activeIcon = ['pi pi-eraser', { tool: DrawTools.eraser }];
      },
    },
    {
      icon: 'fa-solid fa-brush',
      command: () => {
        this.activeIcon = ['fa-solid fa-brush', { tool: DrawTools.brush }];
      },
    },
    {
      icon: 'pi pi-pencil',
      command: () => {
        this.activeIcon = ['pi pi-pencil', { tool: DrawTools.pen }];
      },
    },
  ];

  public riddleWordFrom = new FormGroup({
    riddleWord: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  public canvasToolsFrom = new FormGroup({
    colorPicker: new FormControl('#000', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    sizeRange: new FormControl(3, {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  constructor(
    private confirmationService: ConfirmationService,
    private gameWebsocketServer: WebsocketGameService,
    private router: Router,
    private changeDetection: ChangeDetectorRef
  ) {}

  public confirm(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Is this word correct and you want to submit it?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (!this.riddleWordFrom.valid) {
          markAsDirty(this.riddleWordFrom.controls);
          return;
        }
        this.riddleWord = this.riddleWordFrom.controls.riddleWord.value;
        this.showCanvas = true;
        this.gameWebsocketServer.setRiddleWord(this.riddleWord);
      },
    });
  }

  ngOnInit() {
    this.gameWebsocketServer.next$.next(false);
    this.gameWebsocketServer.switchHost$.next(false);
    this.gameWebsocketServer.switchHost$.subscribe((value) => {
      if (value) {
        console.log('switch to client');
        this.router.navigate(['/client']);
      }
    });
    this.gameWebsocketServer.next$.subscribe((value) => {
      if (value) {
        this.showCanvas = false;
        this.changeDetection.detectChanges();
      }
    });
  }

  public saveCanvas(canvas: HTMLCanvasElement) {
    saveCanvas(canvas);
  }

  public clearCanvas(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    clearCanvas(ctx);
  }
}
