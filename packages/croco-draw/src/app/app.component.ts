import { Component, OnInit } from '@angular/core';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { WebsocketMainService } from './croco/services/websocket.main.service';
import { WebsocketGameService } from './croco/services/websoket.game.service';
import {
  FailedConnectionToMain,
  SuccessConnectionToMain,
} from '../messages/main-server.messages';
import {
  FailedConnectionToGame,
  SuccessConnectionToGame,
} from '../messages/game-server.messages';

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
        this.messageService.add(FailedConnectionToMain);
        return;
      }
      this.messageService.add(SuccessConnectionToMain);
    });
    this.gameWebsocketService.onConnected$.subscribe((isConnected) => {
      if (!isConnected) {
        this.messageService.add(FailedConnectionToGame);
        return;
      }
      this.messageService.add(SuccessConnectionToGame);
    });
  }
}
