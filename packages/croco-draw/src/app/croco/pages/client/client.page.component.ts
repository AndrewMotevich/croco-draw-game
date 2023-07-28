import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'croco-client.page',
  templateUrl: './client.page.component.html',
  styleUrls: ['./client.page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientPageComponent {}
