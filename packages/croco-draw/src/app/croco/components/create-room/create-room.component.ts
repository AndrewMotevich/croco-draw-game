import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { generateErrorExpression } from '../../utils/generateErrorExpression';
import { markAsDirty } from '../../utils/markAsDirty';
import { WebsocketMainService } from '../../services/websocket.main.service';
import { WebsocketGameService } from '../../services/websoket.game.service';
import { UntilDestroy } from '@ngneat/until-destroy';
import { TextFieldValidationRegex } from '../../constants/constants';

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
      validators: [
        Validators.required,
        Validators.pattern(TextFieldValidationRegex),
      ],
    }),
    roomName: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.pattern(TextFieldValidationRegex),
      ],
    }),
    createRoomPassword: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  constructor(
    private mainWebsocketService: WebsocketMainService,
    private gameWebsocketService: WebsocketGameService
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
    });
  }

  public showCreateRoomDialog() {
    this.createRoomDialog = true;
  }
}
