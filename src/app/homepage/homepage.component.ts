import { Component } from '@angular/core';
import { FeedbackService } from '../service/feedback.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'] // Only local styles here
})
export class HomepageComponent {
  feedback = {
    name: '',
    email: '',
    address: '',
    phone: '',
    message: '',
    rating: ''
  };

  constructor(private feedbackService: FeedbackService) {}

  submitFeedback(form: any) {
    if (form.invalid) return;

    const payload = {
      name: this.feedback.name,
      email: this.feedback.email,
      message: this.feedback.message,
      rating: +this.feedback.rating
    };

    this.feedbackService.submitFeedback(payload).subscribe({
      next: () => {
        alert('Feedback submitted successfully!');
        form.resetForm();
      },
      error: (err) => {
        console.error('Error submitting feedback', err);
        alert('Something went wrong while submitting feedback.');
      }
    });
  }
}

