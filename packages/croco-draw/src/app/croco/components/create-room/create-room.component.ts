import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { generateErrorExpression } from '../../utils/generateErrorExpression';
import { markAsDirty } from '../../utils/markAsDirty';
import { WebsocketMainService } from '../../services/websocket.main.service';
import { WebsocketGameService } from '../../services/websoket.game.service';
import { UntilDestroy } from '@ngneat/until-destroy';
import { Router } from '@angular/router';

@UntilDestroy({ checkProperties: true })
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

  constructor(
    private mainWebsocketService: WebsocketMainService,
    private gameWebsocketService: WebsocketGameService,
    private router: Router
  ) {}

  public submitCreateRoomForm() {
    if (!this.createRoomForm.valid) {
      markAsDirty(this.createRoomForm.controls);
      return;
    }
    const { createRoomPassword, roomName, firstUserName } =
      this.createRoomForm.controls;
    this.mainWebsocketService.createServer(
      createRoomPassword.value,
      roomName.value
    );
    this.mainWebsocketService.hostServerId$.subscribe((id) => {
      this.gameWebsocketService.setCredentials(
        id,
        createRoomPassword.value,
        firstUserName.value
      );
      this.gameWebsocketService.newGameConnection();
      this.router.navigate(['/room']);
    });
  }

  public showCreateRoomDialog() {
    this.createRoomDialog = true;
  }
}
