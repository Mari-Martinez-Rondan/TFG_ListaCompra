import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// coreProviders are registered globally in app.config.ts

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'tfg-listacompra';
}
