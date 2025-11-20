import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private messageSubject = new Subject<string>();
  private lastMessage: string | null = null;

  show(message: string): void {
    this.lastMessage = message;
    this.messageSubject.next(message);
  }

  /** Clear the current message and notify subscribers to hide it. */
  clear(): void {
    this.lastMessage = null;
    // Emit an empty string which components treat as 'no message'
    this.messageSubject.next('');
  }

  /**
   * Pop a pending message that was emitted before a subscriber existed.
   * Returns the message (and clears it) or null if none.
   */
  popMessage(): string | null {
    const m = this.lastMessage;
    this.lastMessage = null;
    return m;
  }

  getMessage(): Observable<string> {
    return this.messageSubject.asObservable();
  }
}
