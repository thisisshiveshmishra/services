import { Component, OnInit, Renderer2 } from '@angular/core';
import { ServiceProviderService, ImageResponseDTO } from 'src/app/services/service-provider.service';
import { Serviceprovider } from 'src/app/model/serviceprovider';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FeedbackService } from 'src/app/services/feedback.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { SharedService } from 'src/app/services/shared.service';
 
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
  selectedProvider: Serviceprovider | null = null;
  providerImages: string[] = [];
  isModalOpen = false;
 
  constructor(
    private fb: FormBuilder,
    private feedbackService: FeedbackService,
    private serviceProviderService: ServiceProviderService,
    private router: Router,
    private userService: UserService,
    private sharedService: SharedService,
    private renderer: Renderer2
  ) {
    this.feedbackForm = this.fb.group({
      name: ['', Validators.required],
      phoneNumber: [''],
      email: ['', [Validators.required, Validators.email]],
      address: [''],
      message: ['', Validators.required],
      category: ['', Validators.required],
      customCategory: [''],
      rating: ['', Validators.required]
    });
  }
 
 ngOnInit(): void {
    this.loadCategoriesFromDatabase();
  this.serviceProviderService.getAllProviders().subscribe((data: Serviceprovider[]) => {
  // ✅ Only approved providers
  this.providers = data.filter(p => p.approved === true).slice(0, 4);
 
  this.providers.forEach(provider => {
    if (provider.profilePicture) {
      provider.profilePictureBase64 = 'data:image/jpeg;base64,' + provider.profilePicture;
    }
  });
});
 
  }
 
  ngAfterViewInit(): void {
    this.renderer.listen('window', 'scroll', () => {
      // Adjust selector depending on your navbar collapse element's ID (default: 'navbarSupportedContent')
      const collapseMenu = document.getElementById('navbarSupportedContent');
      const navbarToggler = document.querySelector('.navbar-toggler') as HTMLElement;
      // Only execute if menu is open and in mobile/tablet mode
      if (
        collapseMenu &&
        collapseMenu.classList.contains('show') &&
        navbarToggler &&
        window.innerWidth <= 991 // Bootstrap md and down (mobile/tablet)
      ) {
        navbarToggler.click();
      }
    });
  }
 
  loadCategoriesFromDatabase(): void {
    this.serviceProviderService.getAllProviders().subscribe({
      next: (providers) => {
        this.categories = Array.from(new Set(providers.map(p => p.category).filter(Boolean)));
      },
      error: (err) => console.error('Error fetching categories:', err)
    });
  }
 
  onCategoryChange(event: Event): void {
    const selected = (event.target as HTMLSelectElement).value;
    const customControl = this.feedbackForm.get('customCategory');
    this.showCustomCategoryInput = selected === 'Other';
    if (this.showCustomCategoryInput) {
      customControl?.setValidators([Validators.required, Validators.pattern(/^[A-Za-z0-9 ]{3,50}$/)]);
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
        setTimeout(() => this.showConfirmation = false, 3000);
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
    return localStorage.getItem('providerToken') !== null;
  }
 
  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('userToken');
    localStorage.removeItem('providerToken');
    this.router.navigate(['/']);
  }
 
  viewProvider(id?: number): void {
    if (!id) return;
    this.sharedService.setProviderId(id);
    this.serviceProviderService.getProviderById(id).subscribe(provider => {
      this.selectedProvider = provider;
      this.serviceProviderService.getProviderImages(id).subscribe((images: ImageResponseDTO[]) => {
        this.providerImages = images.map(img => img.base64Image);
        this.isModalOpen = true;
      });
    });
  }
 
  closeModal(): void {
    this.isModalOpen = false;
    this.selectedProvider = null;
    this.providerImages = [];
  }


  routeToChat(provider: any) {
    if (!this.userService.isLoggedIn()) {
      alert('Please log in first to chat with the service provider.');
      this.router.navigate(['/userlogin']);
      return;
    }
    this.router.navigate(['/message', provider.id]);
  }
}