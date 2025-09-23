import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Serviceprovider } from 'src/app/model/serviceprovider';
import { SearchRequest, ServiceProviderService, ImageResponseDTO } from 'src/app/services/service-provider.service';
import { SharedService } from 'src/app/services/shared.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.css']
})
export class SearchbarComponent {
  searchForm!: FormGroup;
  submitted = false;

  // data arrays
  allResults: Serviceprovider[] = [];
  providers: Serviceprovider[] = [];
  availableLocations: string[] = [];
  availableCategories: string[] = [];
  filteredLocations: string[] = [];

  // UI states
  showLocationSuggestions = false;
  selectedProvider: Serviceprovider | null = null;
  providerImages: string[] = [];
  isModalOpen = false;
  message = '';
  savedLocationUrl: string = '';

  constructor(
    private fb: FormBuilder,
    private serviceProviderService: ServiceProviderService,
    private router: Router,
    private sharedService: SharedService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      category: [''],
      location: [''],
    });
    // this.getAllProviders();
    this.loadFilterOptions();
  }


  loadFilterOptions(): void {
  this.serviceProviderService.getAllProviders().subscribe({
    next: (data) => {
      const approved = data.filter(p => p.approved === true);
      this.availableLocations = Array.from(new Set(approved.map(p => p.location).filter(Boolean)));
      this.availableCategories = Array.from(new Set(approved.map(p => p.category).filter(Boolean)));
    }
  });
}


  // ✅ handle search logic
  onSearch(): void {
    this.submitted = true;
    this.message = '';

    let category = this.searchForm.value.category?.trim() || '';
    let location = this.searchForm.value.location?.trim() || '';

    // BOTH are "ALL" → get all
    if (category === 'ALL' && location === 'ALL') {
      this.getAllProviders();
      return;
    }

    // If either is "ALL" treat as empty (search only by the other)
    if (category === 'ALL') category = '';
    if (location === 'ALL') location = '';

    // If both empty → get all
    if (!category && !location) {
      this.getAllProviders();
      return;
    }

    // Otherwise, search
    const searchPayload: SearchRequest = { category, location };

    this.serviceProviderService.searchProviders(searchPayload).subscribe({
      next: (data) => {
        this.allResults = data.filter(p => p.approved === true);
        if (this.allResults.length === 0) this.message = 'No providers found.';
      },
      error: (err) => {
        console.error('Search failed:', err);
        this.allResults = [];
        this.message = 'Error during search';
      },
    });
  }

  // ✅ load all providers (approved only)
  getAllProviders(): void {
    this.serviceProviderService.getAllProviders().subscribe({
      next: (data) => {
        this.allResults = data.filter(p => p.approved === true);
        this.providers = this.allResults;
        this.availableLocations = Array.from(new Set(this.allResults.map(p => p.location).filter(Boolean)));
        this.availableCategories = Array.from(new Set(this.allResults.map(p => p.category).filter(Boolean)));
        if (this.allResults.length === 0) this.message = 'No providers found.';
      },
      error: (err) => {
        console.error('Failed to load providers:', err);
        this.allResults = [];
        this.message = 'Error loading providers';
      }
    });
  }

  // ✅ autocomplete location
  onLocationInput(): void {
    const input = this.searchForm.get('location')?.value?.toLowerCase() || '';
    const hasAlphabet = /[a-zA-Z]/.test(input);
    if (hasAlphabet) {
      this.filteredLocations = this.availableLocations.filter(loc =>
        loc.toLowerCase().includes(input)
      );
      this.showLocationSuggestions = this.filteredLocations.length > 0;
    } else {
      this.filteredLocations = [];
      this.showLocationSuggestions = false;
    }
  }

  selectLocation(loc: string): void {
    this.searchForm.get('location')?.setValue(loc);
    this.showLocationSuggestions = false;
  }

  hideSuggestionsWithDelay(): void {
    setTimeout(() => this.showLocationSuggestions = false, 200);
  }

  // ✅ provider modal
  viewProvider(id?: number): void {
    if (!id) return;
    this.sharedService.setProviderId(id);
    this.serviceProviderService.getProviderById(id).subscribe(provider => {
      this.selectedProvider = provider;
      this.serviceProviderService.getProviderImages(id).subscribe((images: ImageResponseDTO[]) => {
        this.providerImages = images.map(img => img.base64Image);
        this.loadSavedLocation(id);
        this.isModalOpen = true;
      });
    });
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedProvider = null;
    this.providerImages = [];
  }

  // ✅ chat
  routeToChat(provider: any) {
    if (!this.userService.isLoggedIn()) {
      alert('Please log in first to chat with the service provider.');
      this.router.navigate(['/userlogin']);
      return;
    }
    this.router.navigate(['/message', provider.id]);
  }

  // ✅ saved map location
  loadSavedLocation(providerId: number) {
    this.serviceProviderService.getAddressByServiceProviderId(providerId).subscribe({
      next: (res) => {
        if (res && res.length > 0) {
          this.savedLocationUrl = res[0].location_url;
        } else {
          this.savedLocationUrl = '';
        }
      },
      error: (err) => {
        console.warn('No saved location found for provider', err);
        this.savedLocationUrl = '';
      }
    });
  }

  viewLocation() {
    if (!this.savedLocationUrl) {
      alert('No location saved yet!');
      return;
    }
    window.open(this.savedLocationUrl, '_blank');
  }
}
