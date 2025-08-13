import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewChecked
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'src/app/services/message.service';
import { UserService } from 'src/app/services/user.service';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit, OnDestroy, AfterViewChecked {
  providerId!: number;
  userId!: number;
  messages: any[] = [];
  newMessage: string = '';
  autoRefreshSubscription!: Subscription;
  shouldScroll: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private messageService: MessageService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.providerId = Number(this.route.snapshot.paramMap.get('id'));
    const currentUser = this.userService.getCurrentUser();

    if (currentUser && currentUser.id) {
      this.userId = currentUser.id;
      this.loadMessages();

      // Auto-refresh every 5 seconds
      this.autoRefreshSubscription = interval(5000).subscribe(() => {
        this.loadMessages();
      });
    } else {
      console.error('User not logged in.');
    }
  }

  ngOnDestroy() {
    if (this.autoRefreshSubscription) {
      this.autoRefreshSubscription.unsubscribe();
    }
  }

  ngAfterViewChecked() {
    if (this.shouldScroll) {
      this.shouldScroll = false;
    }
  }

  loadMessages() {
    if (!this.providerId || !this.userId) return;

    this.messageService.getMessagesByProviderAndUser(this.providerId, this.userId).subscribe(
      data => {
        this.messages = data || [];
        this.shouldScroll = true; // Flag scroll after DOM update
      },
      err => {
        console.error('Error loading messages', err);
      }
    );
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;

    const message = {
      content: this.newMessage.trim()
    };

    this.messageService.sendMessage(this.userId, this.providerId, message).subscribe(
      () => {
        this.newMessage = '';
        this.loadMessages(); // Refresh messages after sending
      },
      err => {
        console.error('Error sending message:', err);
        alert('Failed to send message');
      }
    );
  }

  sendReply(messageId: number, replyText: string) {
    if (!replyText.trim()) return;

    const replyPayload = { replyContent: replyText.trim() };

    this.messageService.sendReply(messageId, replyPayload).subscribe(
      () => {
        alert('Reply sent successfully!');
        this.loadMessages();
      },
      err => {
        console.error('Error sending reply:', err);
        alert('Failed to send reply');
      }
    );
  }

 
}
