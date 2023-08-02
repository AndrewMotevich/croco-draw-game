import { ChangeDetectionStrategy, Component } from '@angular/core';
import { generateErrorExpression } from '../../utils/generateErrorExpression';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { markAsDirty } from '../../utils/markAsDirty';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'croco-client.page',
  templateUrl: './client.page.component.html',
  styleUrls: ['./client.page.component.scss'],
  providers: [MessageService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientPageComponent {
  errorExpression = generateErrorExpression;
  riddleWord = 'answer';
  isAnswerValid = false;

  riddleWordFrom = new FormGroup({
    riddleWord: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  constructor(private messageService: MessageService) {}

  submitAnswer() {
    if (!this.riddleWordFrom.valid) {
      markAsDirty(this.riddleWordFrom.controls);
      return;
    }
    this.compareAnswer(this.riddleWordFrom.controls.riddleWord.value);
  }

  compareAnswer(answer: string) {
    if (answer !== this.riddleWord) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Wrong answer',
      });
    }
    // add next step
  }
}
