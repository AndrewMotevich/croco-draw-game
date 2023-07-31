import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { markAsDirty } from '../../utils/markAsDirty';
import { ConfirmationService } from 'primeng/api';
import { generateErrorExpression } from '../../utils/generateErrorExpression';
import { DrawTools } from 'libs/croco-common-interfaces/src/lib/enums';
import { clearCanvas, saveCanvas } from '../../helpers/draw.helper';

@Component({
  selector: 'croco-paint-panel',
  templateUrl: './paint-panel.component.html',
  styleUrls: ['./paint-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
})
export class PaintPanelComponent {
  errorExpression = generateErrorExpression;

  riddleWord!: string;

  activeIcon: [string, { tool: DrawTools }] = [
    'pi pi-pencil',
    { tool: DrawTools.pen },
  ];

  items = [
    {
      icon: 'pi pi-pencil',
      command: () => {
        this.activeIcon = ['pi pi-pencil', { tool: DrawTools.pen }];
      },
    },
    {
      icon: 'fa-solid fa-brush',
      command: () => {
        this.activeIcon = ['fa-solid fa-brush', { tool: DrawTools.brush }];
      },
    },
    {
      icon: 'pi pi-eraser',
      command: () => {
        this.activeIcon = ['pi pi-eraser', { tool: DrawTools.eraser }];
      },
    },
    {
      icon: 'pi pi-eraser',
      command: () => {
        this.activeIcon = ['pi pi-eraser', { tool: DrawTools.fill }];
      },
    },
  ];

  riddleWordFrom = new FormGroup({
    riddleWord: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  canvasToolsFrom = new FormGroup({
    colorPicker: new FormControl('#000', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    sizeRange: new FormControl(3, {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  constructor(private confirmationService: ConfirmationService) {}

  confirm(event: Event) {
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
      },
    });
  }

  saveCanvas(canvas: HTMLCanvasElement) {
    saveCanvas(canvas);
  }

  clearCanvas(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    clearCanvas(ctx);
  }
}
