import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageModule } from 'primeng/image';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'croco-header',
  standalone: true,
  imports: [CommonModule, ImageModule, ButtonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  constructor(private router: Router) {}

  public navigateTo(path: string) {
    this.router.navigate([path]);
  }
}
