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
  results: Serviceprovider[] = [];
  submitted = false;
  providers: Serviceprovider[] = [];
  availableLocations: string[] = [];
  availableCategories: string[] = [];
  filteredLocations: string[] = [];
  showLocationSuggestions = false;
  selectedProvider: Serviceprovider | null = null;
  providerImages: string[] = [];
  isModalOpen = false;
  message = '';

  // Final array for UI binding
allResults: any[] = [];
 
  constructor(
    private fb: FormBuilder,
    private serviceProviderService: ServiceProviderService,
    private router: Router,
    private sharedService: SharedService,
    private userService: UserService,
  ) {}
 
  ngOnInit(): void {
    this.searchForm = this.fb.group({
      category: [''],
      location: [''],
    });
    this.getAllProviders();
  }
 
/*  onSearch(): void {
  this.submitted = true;
  this.message = '';

  let category = this.searchForm.value.category?.trim() || '';
  let location = this.searchForm.value.location?.trim() || '';

  // If user selected "View All"
  if (category === 'ALL') category = '';
  if (location === 'ALL') location = '';

  // If both empty → treat as "View All"
  if (!category && !location) {
    this.getAllProviders();
    return;
  }

  const searchPayload: SearchRequest = { category, location };

  this.serviceProviderService.searchProviders(searchPayload).subscribe({
    next: (data) => {
      this.results = data;
      if (this.results.length === 0) this.message = 'No providers found.';
    },
    error: (err) => {
      console.error('Search failed:', err);
      this.results = [];
      this.message = 'Error during search';
    },
  });
}*/

// onSearch(): void {
//   this.submitted = true;
//   this.message = '';

//   let category = this.searchForm.value.category?.trim() || '';
//   let location = this.searchForm.value.location?.trim() || '';

//   // ✅ If user selects BOTH "View All"
//   if (category === 'ALL' && location === 'ALL') {
//     console.log('Both selected all');
//     this.loadProviders();
//     return;
//   }

//   // ✅ If only one is "ALL", treat it as empty (search by other field)
//   if (category === 'ALL') category = '';
//   if (location === 'ALL') location = '';

//   // ✅ If both empty (nothing selected or typed) → treat as View All
//   if (!category && !location) {
//     this.getAllProviders();
//     return;
//   }

//   // ✅ Otherwise perform filtered search
//   const searchPayload: SearchRequest = { category, location };

//   this.serviceProviderService.searchProviders(searchPayload).subscribe({
//     next: (data) => {
//       this.results = data;
//       if (this.results.length === 0) this.message = 'No providers found.';
//     },
//     error: (err) => {
//       console.error('Search failed:', err);
//       this.results = [];
//       this.message = 'Error during search';
//     },
//   });
// }

 


onSearch() {
  this.submitted = true;
  const category = this.searchForm.get('category')?.value;
  const location = this.searchForm.get('location')?.value;

  // ✅ If BOTH "View All"
  if (category === 'ALL' && location === 'ALL') {
    this.loadProviders(); // fills allResults
    return;
  }

  // ✅ Search API
  this.serviceProviderService.searchProviders({ category, location }).subscribe({
    next: (data) => {
      this.allResults = data;  // 👈 merge directly
    },
    error: (err) => {
      console.error('Search failed:', err);
      this.allResults = [];
    }
  });
}

  getAllProviders(): void {
    this.serviceProviderService.getAllProviders().subscribe((data) => {
      this.providers = data;
      this.availableLocations = Array.from(new Set(data.map(p => p.location).filter(Boolean)));
      this.availableCategories = Array.from(new Set(data.map(p => p.category).filter(Boolean)));
    });
  }

  viewAll(): void {
  this.searchForm.reset({ category: '', location: '' });
  this.getAllProviders();
  this.submitted = true;
  this.message = '';
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


  loadProviders() {
  this.serviceProviderService.getAllProviders().subscribe({
    next: (data) => {
      // ✅ Keep only approved providers
      this.allResults = data.filter(p => p.approved === true);

      if (this.allResults.length === 0) {
        this.message = 'No approved providers found.';
      }
    },
    error: (err) => {
      console.error('Failed to load providers:', err);
      this.allResults = [];
      this.message = 'Error loading providers';
    }
  });
}

}
 
 