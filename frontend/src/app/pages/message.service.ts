import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private messages: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  getMessages(): BehaviorSubject<string[]> {
    return this.messages;
  }

  addMessage(message: string): void {
    const currentMessages = this.messages.getValue();
    this.messages.next([...currentMessages, message]);
  }
}
