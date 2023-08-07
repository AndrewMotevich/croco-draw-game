import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'croco-error.page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error.page.component.html',
  styleUrls: ['./error.page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorPageComponent {}
