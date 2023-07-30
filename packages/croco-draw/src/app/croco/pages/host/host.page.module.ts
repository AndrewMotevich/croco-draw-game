import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaintPanelComponent } from '../../components/paint-panel/paint-panel.component';
import { HostPageComponent } from './host.page.component';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmPopupModule } from 'primeng/confirmpopup';

@NgModule({
  declarations: [HostPageComponent, PaintPanelComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    ConfirmPopupModule,
  ],
})
export class HostPageModule {}
