import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { MainPageComponent } from './croco/pages/main/main.page.component';
import { appRoutingModule } from './app-routing.module';
import { ButtonModule } from 'primeng/button';

@NgModule({
  declarations: [AppComponent, MainPageComponent],
  imports: [BrowserModule, appRoutingModule, ButtonModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
