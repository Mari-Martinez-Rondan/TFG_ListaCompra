import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar';
import { NavbarComponent } from '../../shared/components/navbar/navbar';
import { FooterComponent } from '../../shared/components/footer/footer';
import { NotificationService } from '../../core/services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-mainlayout',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, SidebarComponent, RouterOutlet, CommonModule],
  templateUrl: './mainlayout.html',
  styleUrls: ['./mainlayout.css']
})
export class MainLayout {
  welcomeMessage: string | null = null;
  private sub: Subscription | null = null;

  constructor(private notificationService: NotificationService) {
    this.sub = this.notificationService.getMessage().subscribe((msg) => {
      // live messages
      this.showMessage(msg);
    });

    // If a message was emitted before this layout was created, pop it and show
    const pending = this.notificationService.popMessage();
    if (pending) {
      this.showMessage(pending);
    }
  }

  private showMessage(msg: string): void {
    // Treat empty string as no message
    this.welcomeMessage = msg && msg.length > 0 ? msg : null;
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  closeMessage(): void {
    this.welcomeMessage = null;
    this.notificationService.clear();
  }
}