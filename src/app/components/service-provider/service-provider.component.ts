import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Serviceprovider } from 'src/app/model/serviceprovider';
import { FeedbackService } from 'src/app/services/feedback.service';
import { ServiceProviderService } from 'src/app/services/service-provider.service';
import { SharedService } from 'src/app/services/shared.service';
import { UserService } from 'src/app/services/user.service';

 
@Component({
  selector: 'app-service-provider',
  templateUrl: './service-provider.component.html',
  styleUrls: ['./service-provider.component.css']
})
export class ServiceProviderComponent   {
 feedbackForm: FormGroup;
  showConfirmation = false;
  showCustomCategoryInput = false;
  categories: string[] = [];
  providers: Serviceprovider[] = [];
    selectedProvider: Serviceprovider | null = null;
  providerImages: string[] = [];
  isModalOpen = false; // control visibility

 
  constructor(
    private fb: FormBuilder,
    private feedbackService: FeedbackService,
    private serviceProviderService: ServiceProviderService,
    private router: Router,
    private userService: UserService,
        private sharedService: SharedService // 👈 inject it
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


   isLoggedIn(): boolean {
    return !!localStorage.getItem('user');  // returns true if user is logged in
  }

  isServiceProviderLoggedIn(): boolean {
  // Check for service provider token or session
  return localStorage.getItem('providerToken') !== null;

  localStorage.removeItem('userToken');
  localStorage.removeItem('providerToken');
  // Redirect or refresh
}

  logout() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user?.id;

    if (userId) {
      this.userService.logout();
      this.router.navigate(['/']);
      // this.userService.getCurrentUser();
    }

    localStorage.removeItem('user');
    this.router.navigate(['/']);  // redirect to home or login
  }

   viewProvider(id?: number): void {
  if (!id) return;
  this.sharedService.setProviderId(id); // 👈 store providerId globally

  this.serviceProviderService.getProviderById(id).subscribe(provider => {
    this.selectedProvider = provider;
    this.serviceProviderService.getProviderImages(id).subscribe(images => {
      this.providerImages = images;
      this.isModalOpen = true; // show modal
    });
  });
}

closeModal(): void {
  this.isModalOpen = false;
  this.selectedProvider = null;
  this.providerImages = []; 
}
}