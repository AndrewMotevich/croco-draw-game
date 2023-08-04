import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaintPanelComponent } from '../../components/paint-panel/paint-panel.component';
import { HostPageComponent } from './host.page.component';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ColorPickerModule } from 'primeng/colorpicker';
import { SliderModule } from 'primeng/slider';
import { SpeedDialModule } from 'primeng/speeddial';
import { DrawHostDirective } from '../../directives/draw.host.directive';
import { ToastModule } from 'primeng/toast';

@NgModule({
  declarations: [HostPageComponent, PaintPanelComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    ConfirmPopupModule,
    ColorPickerModule,
    SliderModule,
    SpeedDialModule,
    DrawHostDirective,
    ToastModule,
  ],
})
export class HostPageModule {}
