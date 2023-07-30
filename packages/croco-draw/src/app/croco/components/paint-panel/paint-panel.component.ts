import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'croco-paint-panel',
  templateUrl: './paint-panel.component.html',
  styleUrls: ['./paint-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaintPanelComponent {

}
