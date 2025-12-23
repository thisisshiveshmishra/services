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
  loading: boolean = false;

  allResults: Serviceprovider[] = [];
  providers: Serviceprovider[] = [];
  availableLocations: string[] = [];
  availableCategories: string[] = [];
  filteredLocations: string[] = [];

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
  ) { }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      category: [''],
      location: [''],
    });
    this.loadFilterOptions();
  }


  loadFilterOptions(): void {
    this.serviceProviderService.getAllProviders().subscribe({
      next: (data) => {
        console.log('Fetched Data From Backend LoadFilterOpetion', data);
        const approved = data.filter(p => p.approved === true);
        this.availableLocations = Array.from(new Set(approved.map(p => p.location).filter(Boolean))).sort();
        this.availableCategories = Array.from(new Set(approved.map(p => p.category).filter(Boolean))).sort(); // ✅ ascending order
      }
    });
  }

  onSearch(): void {
    this.submitted = true;
    this.message = '';
    this.loading = true;
    this.allResults = [];

    let category = this.searchForm.value.category?.trim() || '';
    let location = this.searchForm.value.location?.trim() || '';

    if (category === 'ALL' && location === 'ALL') {
      category = '';
      location = '';
    }

    if (category === 'ALL') category = '';
    if (location === 'ALL') location = '';

    const searchPayload: SearchRequest = { category, location };

    this.serviceProviderService.searchProviders(searchPayload).subscribe({
      next: (data) => {
        setTimeout(() => {
          this.allResults = data.filter(p => p.approved === true);
          this.allResults.sort((a, b) =>
            (a.firstName + ' ' + a.lastName).localeCompare(b.firstName + ' ' + b.lastName)
          );

          if (this.allResults.length === 0) {
            this.message = 'No providers found.';
          }

          this.loading = false;
        }, 3000);
      },
      error: (err) => {
        console.error('Search failed:', err);
        setTimeout(() => {
          this.loading = false;
          this.message = 'Error during search';
          this.allResults = [];
        }, 3000);
      },
    });
  }

  getAllProviders(): void {
    this.serviceProviderService.getAllProviders().subscribe({
      next: (data) => {
        this.allResults = data.filter(p => p.approved === true);
        this.providers = this.allResults;
        this.availableLocations = Array.from(new Set(this.allResults.map(p => p.location).filter(Boolean))).sort();
        this.availableCategories = Array.from(new Set(this.allResults.map(p => p.category).filter(Boolean))).sort(); // ✅ ascending order

        this.allResults.sort((a, b) => (a.firstName + ' ' + a.lastName).localeCompare(b.firstName + ' ' + b.lastName));

        if (this.allResults.length === 0) this.message = 'No providers found.';
      },
      error: (err) => {
        console.error('Failed to load providers:', err);
        this.allResults = [];
        this.message = 'Error loading providers';
      }
    });
  }


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

  routeToChat(provider: any) {
    if (!this.userService.isLoggedIn()) {
      alert('Please log in first to chat with the service provider.');
      this.router.navigate(['/userlogin']);
      return;
    }
    this.router.navigate(['/message', provider.id]);
  }

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


  goHome(): void {
    this.router.navigate(['/']);
  }
}
