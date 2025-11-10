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
export class ServiceProviderComponent implements OnInit {
  feedbackForm: FormGroup;
  showConfirmation = false;
  showCustomCategoryInput = false;
  categories: string[] = [];
  providers: Serviceprovider[] = [];
  selectedProvider: Serviceprovider | null = null;
  providerImages: string[] = [];
  isModalOpen = false;

  constructor(
    private fb: FormBuilder,
    private feedbackService: FeedbackService,
    private serviceProviderService: ServiceProviderService,
    private router: Router,
    private userService: UserService,
    private sharedService: SharedService
  ) {
    this.feedbackForm = this.fb.group({
      userId: [null], // 👈 store logged-in user's id
      name: ['', Validators.required],
      contactNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      location: ['', Validators.required],
      message: ['', Validators.required],
      category: ['', Validators.required],
      customCategory: [''],
      rating: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCategoriesFromDatabase();
    this.prefillUserData();

    this.serviceProviderService.getAllProviders().subscribe((data: Serviceprovider[]) => {
      this.providers = data.slice(0, 4);
      this.providers.forEach(provider => {
        if (provider.profilePicture) {
          provider.profilePictureBase64 = 'data:image/jpeg;base64,' + provider.profilePicture;
        }
      });
    });
  }

  /** ✅ Prefill data if user or provider logged in */
  prefillUserData(): void {
    if (this.isLoggedIn()) {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
          // 👇 Merge name + surname safely
        const fullName = `${userData?.name || ''} ${userData?.surname || ''}`.trim();
        this.feedbackForm.patchValue({
        userId: userData?.id || null,
        name: fullName,   // 👈 Show merged full name in name field
        contactNumber: userData?.contactNumber || '',
        email: userData?.email || '',
        location: userData?.location || ''
      });
      this.disablePrefilledFields();
    } else if (this.isServiceProviderLoggedIn()) {
      const providerData = JSON.parse(localStorage.getItem('provider') || '{}');
      this.feedbackForm.patchValue({
        name: providerData?.name || providerData?.fullName || '',
        contactNumber: providerData?.contactNumber || providerData?.phoneNumber || '',
        email: providerData?.email || ''
      });
      this.disablePrefilledFields();
    }
  }

  disablePrefilledFields(): void {
    this.feedbackForm.get('name')?.disable();
    this.feedbackForm.get('contactNumber')?.disable();
    this.feedbackForm.get('email')?.disable();
    this.feedbackForm.get('location')?.disable();
  }

  loadCategoriesFromDatabase(): void {
    this.serviceProviderService.getAllProviders().subscribe({
      next: (providers) => {
        const uniqueCategories = Array.from(
          new Set(providers.map(p => p.category).filter(Boolean))
        );
        this.categories = uniqueCategories;
      },
      error: (err) => console.error('Error fetching categories:', err)
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

    // ✅ Include disabled fields too
    let feedback = { ...this.feedbackForm.getRawValue() };

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
          this.router.navigate(['/']);
        }, 3000);
      },
      error: (err) => {
        console.error('Error submitting feedback:', err);
        alert('❌ Failed to submit feedback. Please try again.');
      }
    });
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('user');
  }

  isServiceProviderLoggedIn(): boolean {
    return !!localStorage.getItem('provider');
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('userToken');
    localStorage.removeItem('provider');
    localStorage.removeItem('providerToken');
    this.router.navigate(['/']);
  }

  viewProvider(id?: number): void {
    if (!id) return;
    this.sharedService.setProviderId(id);

    this.serviceProviderService.getProviderById(id).subscribe(provider => {
      this.selectedProvider = provider;
      this.providerImages = [];

      if (provider.profilePicture) {
        this.providerImages.push('data:image/jpeg;base64,' + provider.profilePicture);
      }

      this.isModalOpen = true;
    });
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedProvider = null;
    this.providerImages = [];
  }

  closeForm(): void {
    this.router.navigate(['/']);
  }
}
