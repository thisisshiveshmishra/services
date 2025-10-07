import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {

    sendEmail(event: Event, email: string) {
    event.preventDefault(); // ❌ Prevent route change
    const isLaptop = /Windows|Macintosh|Linux/i.test(navigator.userAgent);
    
    if (isLaptop) {
      // Desktop/Laptop → open Gmail in new tab
      window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${email}`, '_blank');
    } else {
      // Mobile/Tablet → open default mail app
      window.location.href = `mailto:${email}`;
    }
  }
}
