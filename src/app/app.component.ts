import { Component, NgModule } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  imports: [RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'code-nest';
}
@NgModule({
  declarations: [],
  imports: [
    AppComponent,
    BrowserModule,
    RouterModule.forRoot([]), // <-- Add this line if not present
  ],
  providers: [],
})
export class AppModule {}
