import { ChangeDetectionStrategy, Component } from '@angular/core';
import { generateErrorExpression } from '../../utils/generateErrorExpression';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { markAsDirty } from '../../utils/markAsDirty';

@Component({
  selector: 'croco-client.page',
  templateUrl: './client.page.component.html',
  styleUrls: ['./client.page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientPageComponent {
  errorExpression = generateErrorExpression;
  riddleWord = 'answer';
  isAnswerValid = false;

  riddleWordFrom = new FormGroup({
    riddleWord: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, this.compareAnswer()],
    }),
  });

  submitAnswer() {
    console.log(
      this.riddleWordFrom.controls.riddleWord.hasError('isAnswerValid')
    );
    if (!this.riddleWordFrom.valid) {
      markAsDirty(this.riddleWordFrom.controls);
      return;
    }
  }

  private compareAnswer(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const { value } = control;

      if (!value) {
        return null;
      }

      const answerValid = value === this.riddleWord;

      return !answerValid ? { isAnswerValid: true } : null;
    };
  }
}
