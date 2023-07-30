import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { markAsDirty } from '../../utils/markAsDirty';
import { ConfirmationService } from 'primeng/api';
import { generateErrorExpression } from '../../utils/generateErrorExpression';
import { DrawHostService } from '../../services/draw.host.service';

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

  riddleWordFrom = new FormGroup({
    riddleWord: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  constructor(
    private confirmationService: ConfirmationService,
    private drawService: DrawHostService
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
      },
    });
  }
}
