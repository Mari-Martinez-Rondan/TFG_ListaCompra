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

  // Método para limpiar el mensaje actual y notificar a los suscriptores para ocultarlo
  clear(): void {
    this.lastMessage = null;
    // Emitir una cadena vacía que los componentes tratan como 'sin mensaje'
    this.messageSubject.next('');
  }

  // Método para obtener y limpiar el último mensaje
  popMessage(): string | null {
    const m = this.lastMessage;
    this.lastMessage = null;
    return m;
  }

  // Método para obtener el observable de mensajes
  getMessage(): Observable<string> {
    return this.messageSubject.asObservable();
  }
}
