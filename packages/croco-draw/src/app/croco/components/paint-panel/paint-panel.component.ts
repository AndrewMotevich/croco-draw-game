import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { markAsDirty } from '../../utils/markAsDirty';
import { ConfirmationService } from 'primeng/api';
import { generateErrorExpression } from '../../utils/generateErrorExpression';
import { DrawHostService } from '../../services/draw.host.service';
import { WebsocketService } from '../../services/websocket.service';

@Component({
  selector: 'croco-paint-panel',
  templateUrl: './paint-panel.component.html',
  styleUrls: ['./paint-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
})
export class PaintPanelComponent {
  errorExpression = generateErrorExpression;

  riddleWord = 'Sdf';

  activeIcon = ['pi pi-pencil', 'pen'];

  items = [
    {
      icon: 'pi pi-pencil',
      command: () => {
        this.activeIcon = ['pi pi-pencil', 'pen'];
      },
    },
    {
      icon: 'fa-solid fa-brush',
      command: () => {
        this.activeIcon = ['fa-solid fa-brush', 'brush'];
      },
    },
    {
      icon: 'pi pi-eraser',
      command: () => {
        this.activeIcon = ['pi pi-eraser', 'eraser'];
      },
    },
    {
      icon: `fa-solid fa-fill`,
      command: () => {
        this.activeIcon = ['fa-solid fa-fill', 'fill'];
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
    color: new FormControl('#000', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    size: new FormControl(3, {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  constructor(
    private confirmationService: ConfirmationService,
    private drawService: DrawHostService,
    private websocketService: WebsocketService
  ) {}

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
        document.body.addEventListener('click', this.drawService.initCanvas, {
          once: true,
        });
        this.websocketService.log();
      },
    });
  }
}
