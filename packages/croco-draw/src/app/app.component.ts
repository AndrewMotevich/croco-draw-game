import { Component, OnInit } from '@angular/core';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { WebsocketMainService } from './croco/services/websocket.main.service';
import { WebsocketGameService } from './croco/services/websoket.game.service';

@Component({
  selector: 'croco-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [MessageService],
})
export class AppComponent implements OnInit {
  constructor(
    private primengConfig: PrimeNGConfig,
    private mainWebsocketService: WebsocketMainService,
    private gameWebsocketService: WebsocketGameService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.primengConfig.ripple = true;
    this.mainWebsocketService.onMainConnect$.subscribe((isConnected) => {
      if (!isConnected) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail:
            'Connection to MAIN server failed. Please, reload page or try later',
        });
        return;
      }
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Connection to MAIN server is successful!',
      });
    });
    this.gameWebsocketService.onConnected$.subscribe((isConnected) => {
      if (!isConnected) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail:
            'Connection to GAME server failed. Possible options: check password, create new game, reload page or try later',
        });
        return;
      }
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Connection to GAME server is successful!',
      });
    });
  }
}
