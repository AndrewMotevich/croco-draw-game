import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { generateErrorExpression } from '../../utils/generateErrorExpression';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { markAsDirty } from '../../utils/markAsDirty';
import { MessageService } from 'primeng/api';
import { UntilDestroy } from '@ngneat/until-destroy';
import { WebsocketGameService } from '../../services/websoket.game.service';
import { Router } from '@angular/router';
import { WebsocketMainService } from '../../services/websocket.main.service';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'croco-client.page',
  templateUrl: './client.page.component.html',
  styleUrls: ['./client.page.component.scss'],
  providers: [MessageService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientPageComponent implements OnInit {
  private riddleWord = 'answer';
  public errorExpression = generateErrorExpression;
  public isAnswerValid = false;

  public riddleWordFrom = new FormGroup({
    riddleWord: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  constructor(
    private messageService: MessageService,
    private mainWebsocketService: WebsocketMainService,
    private gameWebsocketServer: WebsocketGameService,
    private router: Router
  ) {}

  ngOnInit() {
    this.mainWebsocketService.onMainConnect$.subscribe((isConnected) => {
      if (!isConnected) {
        this.router.navigate(['/main']);
      }
    });
    this.gameWebsocketServer.onConnected$.subscribe((isConnected) => {
      if (!isConnected) {
        this.router.navigate(['/main']);
      }
    });
    this.gameWebsocketServer.answer$.subscribe((answer) => {
      this.riddleWord = answer;
    });
    this.gameWebsocketServer.switchHost$.next(false);
    this.gameWebsocketServer.switchHost$.subscribe((value) => {
      if (value) {
        this.router.navigate(['/host']);
      }
    });
    this.gameWebsocketServer.results$.subscribe((value) => {
      if (value) {
        this.router.navigate(['/room']);
      }
    });
  }

  public submitAnswer() {
    if (!this.riddleWordFrom.valid) {
      markAsDirty(this.riddleWordFrom.controls);
      return;
    }
    this.compareAnswer(this.riddleWordFrom.controls.riddleWord.value);
  }

  private compareAnswer(answer: string) {
    if (answer !== this.riddleWord) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Wrong answer',
      });
      return;
    }
    this.riddleWordFrom.reset();
    this.gameWebsocketServer.nextStep();
    // clear canvas
  }
}
