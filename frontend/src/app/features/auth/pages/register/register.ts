import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})

export class RegisterComponent {
    constructor(private router: Router) {}
  onRegister() {
    this.router.navigate(['/login']);
  }
}

