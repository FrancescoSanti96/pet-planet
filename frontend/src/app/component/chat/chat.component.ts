import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit {
  friendId!: number;
  message: string = '';
  messages: string[] = [];

  constructor(private route: ActivatedRoute, private messageService: MessageService) { }

  ngOnInit(): void {
    const friendIdParam = this.route.snapshot.paramMap.get('friendId');

    if (friendIdParam !== null) {
      this.friendId = +friendIdParam;
      console.log('Inizia la chat con l\'amico con ID:', this.friendId);
    } else {
      console.error('Il parametro friendId è nullo. Imposto un valore predefinito.');
      this.friendId = -1;
    }
  }

  sendMessage(): void {
    const formattedMessage = `Amico ${this.friendId}: ${this.message}`;
    this.messageService.addMessage(formattedMessage);
    this.message = '';
  }
}
