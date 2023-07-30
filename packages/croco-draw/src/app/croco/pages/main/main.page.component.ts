import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { markAsDirty } from '../../utils/markAsDirty';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';

@Component({
  selector: 'croco-main.page',
  templateUrl: './main.page.component.html',
  styleUrls: ['./main.page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainPageComponent {
  public createRoomDialog = false;
  public selectRoomDialog = false;

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

  public selectRoomForm = new FormGroup({
    room: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    selectRoomPassword: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    secondUserName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  public gameRooms = [
    { name: 'room1', roomId: 'abc' },
    { name: 'room2', roomId: 'cba' },
  ];

  public filteredGameRooms!: object[];

  public submitCreateRoomForm() {
    if (!this.createRoomForm.valid) {
      markAsDirty(this.createRoomForm.controls);
      return;
    }
    alert(JSON.stringify(this.createRoomForm.getRawValue()));
  }

  public submitSelectRoomForm() {
    if (!this.selectRoomForm.valid) {
      markAsDirty(this.selectRoomForm.controls);
      return;
    }
    alert(JSON.stringify(this.selectRoomForm.getRawValue()));
  }

  public generateErrorExpression(error: string, control: FormControl) {
    return control.dirty && control.hasError(error);
  }

  public filterRooms(event: AutoCompleteCompleteEvent) {
    const filtered = [];
    const query = event.query;

    for (let i = 0; i < this.gameRooms.length; i++) {
      const room = this.gameRooms[i];
      if (room.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(room);
      }
    }

    this.filteredGameRooms = filtered;
  }

  public showCreateRoomDialog() {
    this.createRoomDialog = true;
  }

  public showSelectRoomDialog() {
    this.selectRoomDialog = true;
  }
}
