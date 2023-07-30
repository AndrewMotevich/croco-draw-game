import { FormControl } from '@angular/forms';

export function generateErrorExpression(error: string, control: FormControl) {
  return control.dirty && control.hasError(error);
}
