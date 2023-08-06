import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoomPageComponent } from './room.page.component';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TagModule } from 'primeng/tag';
import { ReadyTagStylePipe } from '../../pipes/ready-tag-style.pipe';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@NgModule({
  declarations: [RoomPageComponent],
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    ConfirmDialogModule,
    TagModule,
    ReadyTagStylePipe,
    ProgressSpinnerModule,
  ],
})
export class RoomPageModule {}
