import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoomPageComponent } from './room.page.component';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@NgModule({
  declarations: [RoomPageComponent],
  imports: [CommonModule, TableModule, ButtonModule, ConfirmDialogModule],
})
export class RoomPageModule {}
