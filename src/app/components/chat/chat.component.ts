import {
  Component,
  OnInit,
  OnDestroy,
  HostListener,
  ViewChild,
  ElementRef
} from '@angular/core';
import { MessageService } from 'src/app/services/message.service';
import { ServiceProviderService } from 'src/app/services/service-provider.service';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  @ViewChild('chatBody') chatBody!: ElementRef;

  providerId!: number;
  providerMessages: any[] = [];
  groupedMessages: { [userId: string]: any[] } = {};
  selectedUserId: string | null = null;
  replies: { [userId: string]: string } = {};
  isMobile: boolean = false;

  readUsers: Set<string> = new Set();
  private refreshSubscription!: Subscription;

  constructor(
    private messageService: MessageService,
    private providerService: ServiceProviderService
  ) {}

  ngOnInit(): void {
    this.checkScreenSize();

    const email = localStorage.getItem('providerEmail');
    if (email) {
      this.providerService.getProviderByEmail(email).subscribe((provider) => {
        this.providerId = provider.id;
        this.fetchMessages();

        // Auto-refresh every 10 seconds
        this.refreshSubscription = interval(10000).subscribe(() => {
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
  if (!this.chatBody) {
    // Just fetch normally if chat body not initialized yet
    this.messageService.getMessagesByProvider(this.providerId).subscribe((messages) => {
      this.providerMessages = messages;
      this.groupedMessages = this.groupByUser(messages);
    });
    return;
  }

  // Capture current scroll position before update
  const chatElement = this.chatBody.nativeElement;
  const previousScrollHeight = chatElement.scrollHeight;
  const previousScrollTop = chatElement.scrollTop;
  const isAtBottom = previousScrollHeight - (previousScrollTop + chatElement.clientHeight) < 100;

  // Fetch new messages
  this.messageService.getMessagesByProvider(this.providerId).subscribe((messages) => {
    this.providerMessages = messages;
    this.groupedMessages = this.groupByUser(messages);

    // After updating messages, wait for DOM to render
    setTimeout(() => {
      const newScrollHeight = chatElement.scrollHeight;

      if (isAtBottom) {
        // ✅ Stay auto-scrolled if already near bottom
        chatElement.scrollTop = chatElement.scrollHeight;
      } else {
        // ✅ Preserve user's position when scrolling up
        const scrollDiff = newScrollHeight - previousScrollHeight;
        chatElement.scrollTop = previousScrollTop + scrollDiff;
      }
    }, 200);
  });
}


  // Group messages and replies
  groupByUser(messages: any[]): { [key: string]: any[] } {
    const grouped: { [key: string]: any[] } = {};

    for (const msg of messages) {
      const uid = msg.userId?.toString();
      if (!uid) continue;
      if (!grouped[uid]) grouped[uid] = [];

      // user message
      grouped[uid].push({
        id: msg.id,
        userName: msg.userName,
        userSurname: msg.userSurname,
        content: msg.content,
        sentTime: msg.sentTime,
        isReply: false
      });

      // provider replies
      if (msg.replies?.length) {
        msg.replies.forEach((r: any) => {
          grouped[uid].push({
            id: r.id,
            userName: 'You',
            content: r.replyContent,
            sentTime: r.createdAt,
            isReply: true
          });
        });
      }
    }

    // sort messages chronologically
    for (const uid in grouped) {
      grouped[uid].sort(
        (a, b) => new Date(a.sentTime).getTime() - new Date(b.sentTime).getTime()
      );
    }

    return grouped;
  }

  get sortedUserIds(): string[] {
    return Object.keys(this.groupedMessages).sort((a, b) => {
      const lastA = this.groupedMessages[a].slice(-1)[0];
      const lastB = this.groupedMessages[b].slice(-1)[0];
      return new Date(lastB.sentTime).getTime() - new Date(lastA.sentTime).getTime();
    });
  }

  // Select user
  selectUser(userId: string) {
    this.selectedUserId = userId;
    this.readUsers.add(userId);

    if (!this.replies[userId]) this.replies[userId] = '';

    console.log('Selected user:', userId);

    // Scroll to last message
    setTimeout(() => this.scrollToBottom(true), 150);
  }

  // Send reply
  sendReply(userId: string) {
    const replyText = (this.replies[userId] || '').trim();
    if (!replyText) return;

    const userMessages = this.groupedMessages[userId].filter((m) => !m.isReply && m.id);
    if (!userMessages.length) return;

    const lastUserMsgId = userMessages[userMessages.length - 1].id;

    const replyData = {
      replyContent: replyText // remove replyTime
    };

    console.log('Reply Data in Send Reply Method:', replyData);

    this.messageService.sendReply(lastUserMsgId, replyData).subscribe({
      next: (savedReply) => {
        console.log('Reply Data returned from API:', savedReply);

        // Clear input
        this.replies[userId] = '';

        // Push locally for instant update
        this.groupedMessages[userId].push({
          id: savedReply.id,
          userName: 'You',
          content: savedReply.replyContent,
          sentTime: savedReply.createdAt,
          isReply: true
        });

        // Sort and scroll
        this.groupedMessages[userId].sort(
          (a, b) => new Date(a.sentTime).getTime() - new Date(b.sentTime).getTime()
        );

        setTimeout(() => this.scrollToBottom(true), 100);
      },
      error: (err) => {
        console.error('❌ Failed to send reply:', err);
        alert('Failed to send reply. Please try again.');
      }
    });
  }

  hasUnread(userId: string): boolean {
    if (this.readUsers.has(userId)) return false;
    const lastMsg = this.groupedMessages[userId]?.slice(-1)[0];
    return lastMsg ? !lastMsg.isReply : false;
  }

  @HostListener('window:resize')
  checkScreenSize() {
    this.isMobile = window.innerWidth <= 768;
    if (this.isMobile && this.selectedUserId) {
      this.selectedUserId = null;
    }
  }

  scrollToBottom(force: boolean = false) {
    try {
      if (this.chatBody) {
        const el = this.chatBody.nativeElement;
        const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 200;
        if (force || isNearBottom) el.scrollTop = el.scrollHeight;
      }
    } catch (err) {
      console.warn('Scroll failed:', err);
    }
  }

  get hasMessages(): boolean {
    return this.providerMessages && this.providerMessages.length > 0;
  }


  getUserDisplayName(userId: string): string {
  const messages = this.groupedMessages[userId];
  if (!messages || !messages.length) return 'Unknown User';

  // Find the first actual user message (not a reply)
  const firstUserMsg = messages.find(m => !m.isReply);
  if (firstUserMsg) {
    return `${firstUserMsg.userName} ${firstUserMsg.userSurname || ''}`.trim();
  }

  // If only replies exist (edge case)
  return 'User';
}

getSelectedUserName(userId: string | null): string {
  if (!userId || !this.groupedMessages[userId]) return '';

  // Find the first non-reply (actual user) message
  const firstUserMsg = this.groupedMessages[userId].find(m => !m.isReply);
  if (firstUserMsg) {
    return `${firstUserMsg.userName} ${firstUserMsg.userSurname || ''}`.trim();
  }

  // Fallback if only replies exist
  return 'User';
}


}
