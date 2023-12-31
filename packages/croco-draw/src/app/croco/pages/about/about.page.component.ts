import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'croco-about.page',
  templateUrl: './about.page.component.html',
  styleUrls: ['./about.page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutPageComponent {}
