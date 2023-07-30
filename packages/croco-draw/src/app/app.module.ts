import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { appRoutingModule } from './app-routing.module';
import { HeaderComponent } from './core/components/header/header.component';
import { FooterComponent } from './core/components/footer/footer.component';
import { MainPageModule } from './croco/pages/main/main.page.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    appRoutingModule,
    HeaderComponent,
    FooterComponent,
    MainPageModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
