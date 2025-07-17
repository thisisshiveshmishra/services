import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { catchError } from 'rxjs';
import { Serviceprovider } from 'src/app/model/serviceprovider';
import { SearchRequest, ServiceProviderService } from 'src/app/services/service-provider.service';

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
  availableCategories: string[] = []; // NEW — dynamic categories
  filteredLocations: string[] = [];
  showLocationSuggestions: boolean = false;
  selectedProvider: Serviceprovider | null = null;
  providerImages: string[] = [];
  isModalOpen = false; // control visibility


  message = '';

  constructor(
    private fb: FormBuilder,
    private serviceProviderService: ServiceProviderService,
  ) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      category: [''],
      location: [''],
    });

    this.getAllProviders(); // Fetch all
  }

  onSearch(): void {
    this.submitted = true;
    this.message = '';
    const searchPayload: SearchRequest = {
      category: this.searchForm.value.category,
      location: this.searchForm.value.location,
    };

    console.log(searchPayload,'this is the search Request');
    
    this.serviceProviderService.searchProviders(searchPayload).subscribe({
      next: (data) => {
        this.results = data;
        console.log('Data Found From Backend',data);
        if (this.results.length === 0) {
          this.message = 'No providers found.';
        }
      },
      error: (err) => {
        console.error('Search failed:', err);
        this.results = [];
        this.message = 'Error during search';
      },
    });
  }

  getAllProviders(): void {
    this.serviceProviderService.getAllProviders().subscribe((data) => {
      this.providers = data;

      // Extract unique non-empty locations
      this.availableLocations = Array.from(
        new Set(data.map((provider) => provider.location).filter((loc) => !!loc))
      );

      // ✅ Extract unique categories
      this.availableCategories = Array.from(
        new Set(data.map((provider) => provider.category).filter((cat) => !!cat))
      );

      console.log('Available Categories:', this.availableCategories);
      console.log('Available Locations:', this.availableLocations);
    });
  }

 onLocationInput(): void {
  const input = this.searchForm.get('location')?.value?.toLowerCase() || '';

  // Only show suggestions if input contains at least one alphabet
  const hasAlphabet = /[a-zA-Z]/.test(input);

  if (hasAlphabet) {
    this.filteredLocations = this.availableLocations.filter((loc) =>
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
    setTimeout(() => {
      this.showLocationSuggestions = false;
    }, 200);
  }


  viewProvider(id?: number): void {
  if (!id) return;
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