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
  ) { }

  ngOnInit() {
    this.providerId = Number(this.route.snapshot.paramMap.get('id'));
    const currentUser = this.userService.getCurrentUser();

    if (currentUser && currentUser.id) {
      this.userId = currentUser.id;

      this.serviceProviderService.getProviderById(this.providerId).subscribe(
        (provider) => {
          this.providerName = `${provider.firstName} ${provider.lastName}`;
        },
        (err) => {
          console.error('Error fetching provider details', err);
          this.providerName = 'Service Provider';
        }
      );

      this.loadMessages(true);

      this.autoRefreshSubscription = interval(5000).subscribe(() => {
        this.loadMessages(false);
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
        this.scrollAfterRender = true;
      },
      (err) => {
        console.error('Error sending message:', err);
        alert('Failed to send message');
      }
    );
  }

  scrollToBottom() {
    try {
      const chatBoxEl = this.chatBox.nativeElement;
      chatBoxEl.scrollTop = chatBoxEl.scrollHeight;
    } catch (err) {
      console.error('Scroll error:', err);
    }
  }

  sendReply(messageId: number, replyText: string) {
    if (!replyText.trim()) return;

    const replyPayload = { replyContent: replyText.trim() };

    this.messageService.sendReply(messageId, replyPayload).subscribe(
      () => {
        this.loadMessages(false);
      },
      (err) => {
        console.error('Error sending reply:', err);
        alert('Failed to send reply');
      }
    );
  }
}