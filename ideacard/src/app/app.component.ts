import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FirebaseModule } from './firebase/firebase.module';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FirebaseModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ideacard';
}
