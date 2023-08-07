import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebsocketMainService } from '../../services/websocket.main.service';
import { Router } from '@angular/router';

@Component({
  selector: 'croco-error.page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error.page.component.html',
  styleUrls: ['./error.page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorPageComponent implements OnInit {
  constructor(
    private mainWebsocketService: WebsocketMainService,
    private router: Router
  ) {}

  ngOnInit() {
    this.mainWebsocketService.onMainConnected$.subscribe((value) => {
      if (value) this.router.navigate(['/main']);
    });
  }
}
