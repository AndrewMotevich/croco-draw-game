import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'croco-host.page',
  templateUrl: './host.page.component.html',
  styleUrls: ['./host.page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HostPageComponent {}
