import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { WebsocketGameService } from '../../services/websoket.game.service';
import { IPlayer } from '@croco/../libs/croco-common-interfaces';
import { ConfirmationService, MessageService } from 'primeng/api';
import { WebsocketMainService } from '../../services/websocket.main.service';
import { Router } from '@angular/router';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'croco-room.page',
  templateUrl: './room.page.component.html',
  styleUrls: ['./room.page.component.scss'],
  providers: [ConfirmationService, MessageService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoomPageComponent implements OnInit {
  public showContent = false;
  public roomName = this.gameWebsocketService.serverName$;
  private roomId = this.gameWebsocketService.serverId$;

  public disableReady = false;
  public myName = '';

  public cols = [
    { field: 'name', header: 'Name' },
    { field: 'host', header: 'Host' },
    { field: 'score', header: 'Score' },
    { field: 'ready', header: 'Ready' },
  ];

  public players: IPlayer[] = [];

  public myPlayerInfo!: IPlayer;

  constructor(
    private mainWebsocketService: WebsocketMainService,
    private gameWebsocketService: WebsocketGameService,
    private changeDetection: ChangeDetectorRef,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {}

  public ngOnInit() {
    this.gameWebsocketService.onGameConnected$.subscribe((isConnected) => {
      if (!isConnected) {
        this.router.navigate(['/main']);
        return;
      }
      this.showContent = true;
      this.changeDetection.markForCheck();
    });
    this.gameWebsocketService.results$.subscribe((value) => {
      if (value) {
        this.disableReady = true;
      }
    });
    this.gameWebsocketService.getPlayers();
    this.gameWebsocketService.players$.subscribe((players) => {
      this.players = players;
      this.changeDetection.markForCheck();
    });
    this.gameWebsocketService.startGame$.next(false);
    this.gameWebsocketService.myUserObject$.subscribe((me) => {
      this.myName = me.name;
      this.myPlayerInfo = me;
      this.changeDetection.markForCheck();
    });
    this.gameWebsocketService.startGame$.subscribe((value) => {
      if (value) {
        this.gameWebsocketService.myUserObject();
        if (this.myPlayerInfo.host) {
          this.router.navigate(['/host']);
        } else if (!this.myPlayerInfo.host) {
          this.router.navigate(['/client']);
        }
      }
    });
  }

  public ready() {
    this.gameWebsocketService.readyToGame();
    this.disableReady = true;
  }

  public confirm() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this room?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.roomId.subscribe((id) => {
          this.mainWebsocketService.removeServer(id);
          this.router.navigate(['/main']);
        });
      },
    });
  }
}
