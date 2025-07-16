import { Component, OnInit } from '@angular/core';
import { ServiceProviderService } from 'src/app/services/service-provider.service';
import { Serviceprovider } from 'src/app/model/serviceprovider';
// import { ServiceProviderService } from 'src/app/services/service-provider.service';
// import { Serviceprovider } from 'src/app/model/serviceprovider';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FeedbackService } from 'src/app/services/feedback.service';


@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
 feedbackForm: FormGroup;
  showConfirmation = false;
  showCustomCategoryInput = false;
  categories: string[] = [];
  providers: Serviceprovider[] = [];
 
  constructor(
    private fb: FormBuilder,
    private feedbackService: FeedbackService,
    private serviceProviderService: ServiceProviderService
  ) {
    this.feedbackForm = this.fb.group({
      name: ['', Validators.required],
      phoneNumber: [''],
      email: ['', [Validators.required, Validators.email]],
      address: [''],
      message: ['', Validators.required],
      category: ['', Validators.required],
      customCategory: [''], // will be conditionally required
      rating: ['', Validators.required]
    });
  }
 
  ngOnInit(): void {
    this.loadCategoriesFromDatabase();
    this.serviceProviderService.getAllProviders().subscribe((data: Serviceprovider[]) => {
    // Limit to first 4 providers
    this.providers = data.slice(0, 4);
 
    this.providers.forEach(provider => {
      if (provider.profilePicture) {
        provider.profilePictureBase64 = 'data:image/jpeg;base64,' + provider.profilePicture;
      }
    });
  });
  }
 
  loadCategoriesFromDatabase(): void {
    this.serviceProviderService.getAllProviders().subscribe({
      next: (providers) => {
        const uniqueCategories = Array.from(
          new Set(providers.map(p => p.category).filter(Boolean))
        );
        this.categories = uniqueCategories;
      },
      error: (err) => {
        console.error('Error fetching categories:', err);
      }
    });
  }
 
  onCategoryChange(event: Event): void {
    const selected = (event.target as HTMLSelectElement).value;
    const customControl = this.feedbackForm.get('customCategory');
    this.showCustomCategoryInput = selected === 'Other';
 
    if (this.showCustomCategoryInput) {
      customControl?.setValidators([
        Validators.required,
        Validators.pattern(/^[A-Za-z0-9 ]{3,50}$/)
      ]);
    } else {
      customControl?.clearValidators();
      customControl?.reset();
    }
 
    customControl?.updateValueAndValidity();
  }
 
  onSubmit(): void {
    if (this.feedbackForm.invalid) {
      this.feedbackForm.markAllAsTouched();
      return;
    }
 
    let feedback = { ...this.feedbackForm.value };
 
    if (feedback.category === 'Other' && feedback.customCategory) {
      feedback.category = feedback.customCategory;
    }
 
    delete feedback.customCategory;
 
    this.feedbackService.submitFeedback(feedback).subscribe({
      next: () => {
        this.feedbackForm.reset();
        this.showConfirmation = true;
        setTimeout(() => {
          this.showConfirmation = false;
        }, 3000);
      },
      error: (err) => {
        console.error('Error submitting feedback:', err);
        alert('❌ Failed to submit feedback. Please try again.');
      }
    });
  }
}