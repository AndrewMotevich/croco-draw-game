import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { generateErrorExpression } from '../../utils/generateErrorExpression';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { markAsDirty } from '../../utils/markAsDirty';
import { MessageService } from 'primeng/api';
import { UntilDestroy } from '@ngneat/until-destroy';
import { WebsocketGameService } from '../../services/websoket.game.service';
import { Router } from '@angular/router';
import { WebsocketMainService } from '../../services/websocket.main.service';
import {
  ShowRightAnswer,
  SuccessAnswer,
  WrongAnswer,
} from '../../../../messages/client.messages';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'croco-client.page',
  templateUrl: './client.page.component.html',
  styleUrls: ['./client.page.component.scss'],
  providers: [MessageService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientPageComponent implements OnInit {
  @ViewChild('canvas') private canvas!: ElementRef<HTMLCanvasElement>;

  private riddleWord = 'answer';
  public errorExpression = generateErrorExpression;
  public isAnswerValid = false;
  public attemptsQnt = 3;

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
    if (answer.toLocaleLowerCase() !== this.riddleWord.toLocaleLowerCase()) {
      this.messageService.add(WrongAnswer);
      if (this.attemptsQnt <= 1) {
        this.attemptsQnt = 3;
        this.messageService.add(ShowRightAnswer(this.riddleWord));
        this.nextStep(false);
        return;
      }
      this.attemptsQnt -= 1;
      return;
    }
    this.messageService.add(SuccessAnswer);
    this.attemptsQnt = 3;
    this.nextStep(true);
  }

  private nextStep(success: boolean) {
    this.riddleWordFrom.reset();
    this.gameWebsocketServer.nextStep(success);
    this.canvas.nativeElement.getContext('2d')?.clearRect(0, 0, 500, 500);
  }
}
