import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewChecked,
  ViewChild,
  ElementRef
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'src/app/services/message.service';
import { UserService } from 'src/app/services/user.service';
import { Subscription, interval } from 'rxjs';
import { ServiceProviderService } from 'src/app/services/service-provider.service';

interface Reply {
  id: number;
  replyContent: string;
  createdAt: string;
}

interface Message {
  id: number;
  userName: string;
  content: string;
  sentTime: string;
  replies: Reply[];
}

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
  providerName: string = '';

  @ViewChild('chatBox') private chatBox!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private messageService: MessageService,
    private userService: UserService,
    private serviceProviderService: ServiceProviderService
  ) {}

  ngOnInit() {
    this.providerId = Number(this.route.snapshot.paramMap.get('id'));
    const currentUser = this.userService.getCurrentUser();

    if (currentUser && currentUser.id) {
      this.userId = currentUser.id;

      // Fetch provider details
      this.serviceProviderService.getProviderById(this.providerId).subscribe(
        provider => {
          this.providerName = `${provider.firstName} ${provider.lastName}`;
        },
        err => {
          console.error('Error fetching provider details', err);
          this.providerName = 'Service Provider';
        }
      );

      this.loadMessages();

      // Auto-refresh every 10 seconds
      this.autoRefreshSubscription = interval(10000).subscribe(() => {
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
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  // ✅ Helper: check if user is viewing bottom
  private isUserNearBottom(): boolean {
    const el = this.chatBox?.nativeElement;
    if (!el) return false;
    const threshold = 150; // pixels from bottom
    const position = el.scrollTop + el.clientHeight;
    const height = el.scrollHeight;
    return height - position < threshold;
  }

  // ✅ Fetch messages safely
  loadMessages() {
    if (!this.providerId || !this.userId) return;

    // Check if user is near bottom before reload
    const shouldAutoScroll = this.isUserNearBottom();

    this.messageService
      .getMessagesByProviderAndUser(this.providerId, this.userId)
      .subscribe(
        data => {
          this.messages = (data || []).map(msg => ({
            ...msg,
            replies: msg.replies || []
          }));

          // Sort messages
          this.messages.sort(
            (a, b) => new Date(a.sentTime).getTime() - new Date(b.sentTime).getTime()
          );

          // Sort replies
          this.messages.forEach((msg: Message) => {
            msg.replies.sort(
              (r1: Reply, r2: Reply) =>
                new Date(r1.createdAt).getTime() - new Date(r2.createdAt).getTime()
            );
          });

          // ✅ Only scroll if user was already near bottom
          this.shouldScroll = shouldAutoScroll;
        },
        err => console.error('Error loading messages', err)
      );
  }

  // ✅ Send new message
  sendMessage() {
    if (!this.newMessage.trim()) return;

    const message = { content: this.newMessage.trim() };

    this.messageService.sendMessage(this.userId, this.providerId, message).subscribe(
      () => {
        this.newMessage = '';
        this.loadMessages();
      },
      err => {
        console.error('Error sending message:', err);
        alert('Failed to send message');
      }
    );
  }

  // ✅ Send reply to specific message
  sendReply(messageId: number, replyText: string) {
    if (!replyText.trim()) return;

    const replyPayload = { replyContent: replyText.trim() };

    this.messageService.sendReply(messageId, replyPayload).subscribe(
      () => {
        this.loadMessages();
      },
      err => {
        console.error('Error sending reply:', err);
        alert('Failed to send reply');
      }
    );
  }

  // ✅ Scroll to bottom safely
  private scrollToBottom(): void {
    try {
      this.chatBox.nativeElement.scrollTop = this.chatBox.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Scroll to bottom failed:', err);
    }
  }
}
