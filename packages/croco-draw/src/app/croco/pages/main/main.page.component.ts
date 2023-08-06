import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { WebsocketMainService } from '../../services/websocket.main.service';

@Component({
  selector: 'croco-main.page',
  templateUrl: './main.page.component.html',
  styleUrls: ['./main.page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainPageComponent implements OnInit {
  public showContent = false;
  constructor(
    private mainWebsocketService: WebsocketMainService,
    private changeDetection: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.mainWebsocketService.onMainConnected$.subscribe((value) => {
      if (value) this.showContent = true;
      else this.showContent = false;
      this.changeDetection.markForCheck();
    });
  }
}
