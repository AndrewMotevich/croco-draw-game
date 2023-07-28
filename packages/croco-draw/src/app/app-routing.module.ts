import { Route, RouterModule } from '@angular/router';
import { NotFoundPageComponent } from './croco/pages/not-found/not-found.page.component';
import { MainPageComponent } from './croco/pages/main/main.page.component';
import { HostPageComponent } from './croco/pages/host/host.page.component';
import { ClientPageComponent } from './croco/pages/client/client.page.component';
import { AboutPageComponent } from './croco/pages/about/about.page.component';
import { NgModule } from '@angular/core';

export const appRoutes: Route[] = [
  { path: 'main', component: MainPageComponent },
  { path: 'about', component: AboutPageComponent },
  {
    path: 'room/:id',
    children: [
      {
        path: 'host',
        component: HostPageComponent,
      },
      {
        path: 'client',
        component: ClientPageComponent,
      },
    ],
  },
  { path: '', redirectTo: 'main', pathMatch: 'full' },
  { path: '**', component: NotFoundPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class appRoutingModule {}
