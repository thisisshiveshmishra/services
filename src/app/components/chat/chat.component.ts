import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { MessageService } from 'src/app/services/message.service';
import { ServiceProviderService } from 'src/app/services/service-provider.service';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  providerId!: number;
  providerMessages: any[] = [];
  groupedMessages: { [userId: string]: any[] } = {};
  selectedUserId: string | null = null;
  replies: { [userId: string]: string } = {};
  objectKeys = Object.keys;
  isMobile: boolean = false;

  private refreshSubscription!: Subscription;

  constructor(
    private messageService: MessageService,
    private providerService: ServiceProviderService
  ) {}

  ngOnInit(): void {
    this.checkScreenSize();

    const email = localStorage.getItem('providerEmail');
    if (email) {
      this.providerService.getProviderByEmail(email).subscribe(provider => {
        this.providerId = provider.id;
        this.fetchMessages();

        // Auto-refresh every 5 seconds
        this.refreshSubscription = interval(5000).subscribe(() => {
          this.fetchMessages();
        });
      });
    }
  }

  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  fetchMessages() {
    this.messageService.getMessagesByProvider(this.providerId).subscribe(messages => {
      this.providerMessages = messages;
      this.groupedMessages = this.groupByUser(messages);
    });
  }

  groupByUser(messages: any[]): { [key: string]: any[] } {
    const grouped: { [key: string]: any[] } = {};
    for (const msg of messages) {
      const uid = msg.userId?.toString();
      if (uid) {
        if (!grouped[uid]) grouped[uid] = [];
        grouped[uid].push(msg);
      }
    }
    return grouped;
  }

  selectUser(userId: string) {
    this.selectedUserId = userId;
  }

  sendReply(userId: string) {
    const reply = (this.replies[userId] || '').trim();
    if (!reply) return;

    const lastMsg = this.groupedMessages[userId].slice(-1)[0];
    this.messageService.sendReply(lastMsg.id, {
      replyContent: reply,
      replyTime: new Date()
    }).subscribe(() => {
      this.replies[userId] = '';
      this.fetchMessages();
    });
  }

  // Check screen size
  @HostListener('window:resize')
  checkScreenSize() {
    this.isMobile = window.innerWidth <= 768;
    // Optional: deselect user if switching to mobile
    if (this.isMobile && this.selectedUserId) {
      this.selectedUserId = null;
    }
  }
}