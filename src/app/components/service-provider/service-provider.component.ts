import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Serviceprovider } from 'src/app/model/serviceprovider';
import { FeedbackService } from 'src/app/services/feedback.service';
import { ServiceProviderService } from 'src/app/services/service-provider.service';
import { SharedService } from 'src/app/services/shared.service';

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
  wordCount = 0;

  constructor(
    private fb: FormBuilder,
    private feedbackService: FeedbackService,
    private spService: ServiceProviderService,
    private router: Router,
    private shared: SharedService
  ) {
    this.feedbackForm = this.fb.group({
      userId: [null],
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
    this.loadCategories();
    this.prefillUserData();
    this.spService.getAllProviders().subscribe(data => {
      this.providers = data.slice(0, 4).map(p => ({
        ...p,
        profilePictureBase64: p.profilePicture ? 'data:image/jpeg;base64,' + p.profilePicture : null
      }));
    });
  }
updateWordCount(): void {
  const messageControl = this.feedbackForm.get('message');
  if (!messageControl) return;

  const message: string = messageControl.value || '';
  this.wordCount = message.trim() ? message.trim().split(/\s+/).length : 0;

  // 🔒 Enforce 200-word limit
  if (this.wordCount > 200) {
    const limitedText = message.trim().split(/\s+/).slice(0, 200).join(' ');
    messageControl.setValue(limitedText, { emitEvent: false });
    this.wordCount = 200;
  }
}


  /** Prefill user/provider data */
  prefillUserData(): void {
    const user = localStorage.getItem('user');
    const provider = localStorage.getItem('provider');
    const data = user ? JSON.parse(user) : provider ? JSON.parse(provider) : null;
    if (!data) return;

    const fullName = user ? `${data.name || ''} ${data.surname || ''}`.trim() : (data.name || data.fullName);
    this.feedbackForm.patchValue({
      userId: user ? data.id : null,
      name: fullName,
      contactNumber: data.contactNumber || data.phoneNumber || '',
      email: data.email || '',
      location: data.location || ''
    });
    ['name', 'contactNumber', 'email', 'location'].forEach(f => this.feedbackForm.get(f)?.disable());
  }

  loadCategories(): void {
    this.spService.getAllProviders().subscribe({
      next: p => this.categories = [...new Set(p.map(x => x.category).filter(Boolean))],
      error: e => console.error('Error fetching categories:', e)
    });
  }

  onCategoryChange(e: Event): void {
    const selected = (e.target as HTMLSelectElement).value;
    const custom = this.feedbackForm.get('customCategory');
    this.showCustomCategoryInput = selected === 'Other';
    if (this.showCustomCategoryInput)
      custom?.setValidators([Validators.required, Validators.pattern(/^[A-Za-z0-9 ]{3,50}$/)]);
    else custom?.clearValidators(), custom?.reset();
    custom?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.feedbackForm.invalid) return this.feedbackForm.markAllAsTouched();

    const feedback = { ...this.feedbackForm.getRawValue() };
    if (feedback.category === 'Other') feedback.category = feedback.customCategory;
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
      error: e => {
        console.error('Error submitting feedback:', e);
        alert('❌ Failed to submit feedback. Please try again.');
      }
    });
  }

  logout(): void {
    ['user', 'userToken', 'provider', 'providerToken'].forEach(k => localStorage.removeItem(k));
    this.router.navigate(['/']);
  }

  viewProvider(id?: number): void {
    if (!id) return;
    this.shared.setProviderId(id);
    this.spService.getProviderById(id).subscribe(p => {
      this.selectedProvider = p;
      this.providerImages = p.profilePicture ? ['data:image/jpeg;base64,' + p.profilePicture] : [];
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
