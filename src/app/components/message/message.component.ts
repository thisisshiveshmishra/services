import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewChecked,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { MessageService } from 'src/app/services/message.service';
import { UserService } from 'src/app/services/user.service';
import { ServiceProviderService } from 'src/app/services/service-provider.service';
 
@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css'],
})
export class MessageComponent implements OnInit, OnDestroy, AfterViewChecked {
  providerId!: number;
  userId!: number;
  messages: any[] = [];
  newMessage: string = '';
  autoRefreshSubscription!: Subscription;
  providerName: string = '';
  private scrollAfterRender: boolean = false;
 
  @ViewChild('chatBox') chatBox!: ElementRef;
 
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
        (provider) => {
          this.providerName = `${provider.firstName} ${provider.lastName}`;
        },
        (err) => {
          console.error('Error fetching provider details', err);
          this.providerName = 'Service Provider';
        }
      );
 
      // Load initial messages
      this.loadMessages(true);
 
      // Auto-refresh every 5 seconds
      this.autoRefreshSubscription = interval(5000).subscribe(() => {
        this.loadMessages(false); // refresh without forcing scroll
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
    if (this.scrollAfterRender) {
      this.scrollToBottom();
      this.scrollAfterRender = false;
    }
  }
 
  // Load messages with option to scroll after render
  loadMessages(scroll: boolean = true) {
    if (!this.providerId || !this.userId) return;
 
    this.messageService
      .getMessagesByProviderAndUser(this.providerId, this.userId)
      .subscribe(
        (data) => {
          this.messages = (data || []).sort(
            (a, b) => new Date(a.sentTime).getTime() - new Date(b.sentTime).getTime()
          );
          if (scroll) this.scrollAfterRender = true;
        },
        (err) => console.error('Error loading messages', err)
      );
  }
 
  // Send message instantly
  sendMessage() {
    if (!this.newMessage.trim()) return;
 
    const messageText = this.newMessage.trim();
    const messagePayload = { content: messageText };
    this.newMessage = '';
 
    this.messageService.sendMessage(this.userId, this.providerId, messagePayload).subscribe(
      (savedMessage) => {
        this.messages.push(
          savedMessage || {
            content: messageText,
            userName: 'You',
            sentTime: new Date(),
            replies: [],
          }
        );
        this.scrollAfterRender = true; // scroll exactly after message render
      },
      (err) => {
        console.error('Error sending message:', err);
        alert('Failed to send message');
      }
    );
  }
 
  // Scroll to bottom perfectly
  scrollToBottom() {
    try {
      const chatBoxEl = this.chatBox.nativeElement;
      chatBoxEl.scrollTop = chatBoxEl.scrollHeight;
    } catch (err) {
      console.error('Scroll error:', err);
    }
  }
 
  // Reply (optional)
  sendReply(messageId: number, replyText: string) {
    if (!replyText.trim()) return;
 
    const replyPayload = { replyContent: replyText.trim() };
 
    this.messageService.sendReply(messageId, replyPayload).subscribe(
      () => {
        this.loadMessages(false); // refresh without forcing scroll
      },
      (err) => {
        console.error('Error sending reply:', err);
        alert('Failed to send reply');
      }
    );
  }
}