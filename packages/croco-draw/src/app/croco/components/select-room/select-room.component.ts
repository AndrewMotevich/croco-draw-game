import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { markAsDirty } from '../../utils/markAsDirty';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { generateErrorExpression } from '../../utils/generateErrorExpression';
import { WebsocketMainService } from '../../services/websocket.main.service';
import { WebsocketGameService } from '../../services/websoket.game.service';
import { UntilDestroy } from '@ngneat/until-destroy';
import { Router } from '@angular/router';

@UntilDestroy({ checkProperties: true })
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
    room: new FormControl<{ name: string; roomId: string }>(
      { roomId: '', name: '' },
      {
        nonNullable: true,
        validators: [Validators.required],
      }
    ),
    selectRoomPassword: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    secondUserName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  public gameRooms: { name: string; roomId: string }[] = [];

  public filteredGameRooms!: object[];

  constructor(
    private mainWebsocketService: WebsocketMainService,
    private gameWebsocketService: WebsocketGameService,
    private router: Router
  ) {
    this.mainWebsocketService.serverList$.subscribe((list) => {
      this.gameRooms.length = 0;
      list.forEach((server) => {
        this.gameRooms.push({ name: server.serverName, roomId: server.roomId });
      });
    });
  }

  public submitSelectRoomForm() {
    if (!this.selectRoomForm.valid) {
      markAsDirty(this.selectRoomForm.controls);
      return;
    }
    const { room, secondUserName, selectRoomPassword } =
      this.selectRoomForm.controls;
    this.gameWebsocketService.setCredentials(
      room.value.roomId,
      selectRoomPassword.value,
      secondUserName.value
    );
    this.gameWebsocketService.newGameConnection();
    this.router.navigate(['/room']);
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
