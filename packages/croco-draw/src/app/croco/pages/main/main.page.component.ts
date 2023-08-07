import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { WebsocketMainService } from '../../services/websocket.main.service';
import { catchError, timeout } from 'rxjs';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import {
  FailedConnectionToMain,
  SuccessConnectionToMain,
} from '../../../../messages/main-server.messages';
import { UntilDestroy } from '@ngneat/until-destroy';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'croco-main.page',
  templateUrl: './main.page.component.html',
  styleUrls: ['./main.page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MessageService],
})
export class MainPageComponent implements OnInit {
  public showContent = false;
  constructor(
    private mainWebsocketService: WebsocketMainService,
    private changeDetection: ChangeDetectorRef,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit() {
    this.mainWebsocketService.onMainConnected$
      .pipe(
        timeout({ first: 3000 }),
        catchError((err) => {
          this.router.navigate(['/error']);
          throw new Error(err.message);
        })
      )
      .subscribe((isConnected) => {
        if (!isConnected) {
          this.showContent = false;
          this.messageService.add(FailedConnectionToMain);
          return;
        }
        this.messageService.add(SuccessConnectionToMain);
        this.showContent = true;
        this.changeDetection.markForCheck();
      });
  }
}
