import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'croco-main.page',
  templateUrl: './main.page.component.html',
  styleUrls: ['./main.page.component.scss'],
  providers: [MessageService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainPageComponent {}
