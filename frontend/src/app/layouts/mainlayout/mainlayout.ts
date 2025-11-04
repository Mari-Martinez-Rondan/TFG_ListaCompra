import { Component } from '@angular/core';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-mainlayout',
  imports: [NavbarComponent, FooterComponent],
  templateUrl: './mainlayout.html',
  styleUrl: './mainlayout.css'
})
export class MainLayout {
  
}