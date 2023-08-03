import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateRoomComponent } from '../../components/create-room/create-room.component';
import { SelectRoomComponent } from '../../components/select-room/select-room.component';
import { MainPageComponent } from './main.page.component';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
  declarations: [MainPageComponent, CreateRoomComponent, SelectRoomComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    DialogModule,
    PasswordModule,
    AutoCompleteModule,
    TooltipModule,
    InputTextModule,
  ],
  exports: [ButtonModule],
})
export class MainPageModule {}
