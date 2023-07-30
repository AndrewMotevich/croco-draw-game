import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { generateErrorExpression } from '../../utils/generateErrorExpression';
import { markAsDirty } from '../../utils/markAsDirty';

@Component({
  selector: 'croco-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateRoomComponent {
  public errorExpression = generateErrorExpression;

  public createRoomDialog = false;

  public createRoomForm = new FormGroup({
    firstUserName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    roomName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    createRoomPassword: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  public submitCreateRoomForm() {
    if (!this.createRoomForm.valid) {
      markAsDirty(this.createRoomForm.controls);
      return;
    }
    alert(JSON.stringify(this.createRoomForm.getRawValue()));
  }

  public showCreateRoomDialog() {
    this.createRoomDialog = true;
  }
}
