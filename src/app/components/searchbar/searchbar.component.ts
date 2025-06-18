import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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
  providers: any[] = [];
  availableLocations: string[] = [];
  filteredLocations: string[] = [];
  selectedLocation: string = '';
  showLocationSuggestions: boolean = false;
  message = '';

  categories = [
    'MOTOR_GARAGE_REPAIRING',
    'HOSPITAL',
    'SPORTS_REGARDS',
    'LAPTOP_REPAIRING',
    'HOTELS',
    'MOB_REPAIRING',
    'EMOTIONAL_GUIDER',
    'HEALTH_ADVISER',
    'BEAUTY_PARLORS',
    'RENT_ROOM_ADVISER',
    'SOFTWARE_QA',
    'DATA_SCIENCE',
    'SOFTWARE_DEVELOPER',
    'CYBER_SECURITY',
    'WATER_SUPPLIER_RO',
    'TOURIST_GUIDER'
  ];


  constructor(
    private fb: FormBuilder,
    private serviceProviderService: ServiceProviderService,
  ) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      category: [''],
      location: ['']
    });


    this.getAllProviders();
  }

  onSearch(): void {
    this.submitted = true;

    const searchPayload: SearchRequest = {
      category: this.searchForm.value.category,
      location: this.searchForm.value.location
    };

    this.serviceProviderService.searchProviders(searchPayload).subscribe({
      next: (data) => this.results = data,
      error: (err) => {
        console.error('Search failed:', err);
        this.results = [];
      }
    });
  }


   getAllProviders(): void {
    this.serviceProviderService.getAllProviders().subscribe(data => {
      this.providers = data;

      // Extract unique non-empty locations
      this.availableLocations = Array.from(
        new Set(data.map(provider => provider.location).filter(loc => !!loc))
      );

      console.log('Available Locations:', this.availableLocations);
    });
  }

  onLocationInput(): void {
const input = this.searchForm.get('location')?.value?.toLowerCase() || '';

    this.filteredLocations = this.availableLocations.filter(loc =>
      loc.toLowerCase().includes(input)
    );

    this.showLocationSuggestions = true;

    // console.log('Filtered:', this.filteredLocations);
    console.log('User Input:', input);
console.log('Filtered Locations:', this.filteredLocations);

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
}


