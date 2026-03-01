import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ToolshopLobbyComponent } from './toolshop-lobby/toolshop-lobby.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'toolshop-lobby',
    component: ToolshopLobbyComponent,
  },
];
