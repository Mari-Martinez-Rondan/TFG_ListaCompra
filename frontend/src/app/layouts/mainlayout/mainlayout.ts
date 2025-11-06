import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar';
import { NavbarComponent } from '../../shared/components/navbar/navbar';
import { FooterComponent } from '../../shared/components/footer/footer';

@Component({
  selector: 'app-mainlayout',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, SidebarComponent, RouterOutlet, CommonModule],
  templateUrl: './mainlayout.html',
  styleUrls: ['./mainlayout.css']
})
export class MainLayout {
  
}