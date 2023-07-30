import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { appRoutingModule } from './app-routing.module';
import { MainPageModule } from './croco/pages/main/main.page.module';
import { HostPageModule } from './croco/pages/host/host.page.module';
import { ClientPageModule } from './croco/pages/client/client.page.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './core/components/header/header.component';
import { FooterComponent } from './core/components/footer/footer.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    appRoutingModule,
    HeaderComponent,
    FooterComponent,
    MainPageModule,
    HostPageModule,
    ClientPageModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
