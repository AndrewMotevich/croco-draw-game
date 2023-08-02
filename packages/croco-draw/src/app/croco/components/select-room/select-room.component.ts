import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { markAsDirty } from '../../utils/markAsDirty';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { generateErrorExpression } from '../../utils/generateErrorExpression';
import { WebsocketService } from '../../services/websocket.service';

@Component({
  selector: 'croco-select-room',
  templateUrl: './select-room.component.html',
  styleUrls: ['./select-room.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectRoomComponent {
  public errorExpression = generateErrorExpression;

  public selectRoomDialog = false;

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

  constructor(private websocketService: WebsocketService) {
    this.websocketService.serverList$.subscribe((res) => console.log(res));
  }

  public submitSelectRoomForm() {
    if (!this.selectRoomForm.valid) {
      markAsDirty(this.selectRoomForm.controls);
      return;
    }
    alert(JSON.stringify(this.selectRoomForm.getRawValue()));
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

  public showSelectRoomDialog() {
    this.selectRoomDialog = true;
  }
}
