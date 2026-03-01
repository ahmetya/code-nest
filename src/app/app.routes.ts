import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ToolshopLobbyComponent } from './toolshop-lobby/toolshop-lobby.component';
import { ToolshopArtComponent } from './toolshop-art/toolshop-art.component';
export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'toolshop-lobby',
    component: ToolshopLobbyComponent,
  },
  {
    path: 'toolshop-art',
    component: ToolshopArtComponent,
  },
];
