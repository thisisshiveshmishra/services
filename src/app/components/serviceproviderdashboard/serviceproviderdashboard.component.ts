import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceProviderService } from 'src/app/services/service-provider.service';


@Component({
  selector: 'app-serviceproviderdashboard',
  templateUrl: './serviceproviderdashboard.component.html',
  styleUrls: ['./serviceproviderdashboard.component.css']
})
export class ServiceproviderdashboardComponent {
//     matches: any[] = [];

//   constructor(private serviceProvider: ServiceProviderService) {}

//   ngOnInit(): void {
//     this.serviceProvider.getMatchesForAllRequests().subscribe((data: any[]) => {
//       console.log("Match data from backend:", data);
//       this.matches = data;
//     });
//   }
// }


  editForm!: FormGroup;
  selectedFile: File | null = null;
  providerEmail!: string;
  providerId!: number;
  profileImageUrl: string = 'https://bootdey.com/img/Content/avatar/avatar7.png';
  categories: string[] = [
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
    private serviceproviderService: ServiceProviderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.editForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      mobileNumber: [''],
      location: [''],
      gender: [''],
      category: ['']
    });

    this.providerEmail = localStorage.getItem('providerEmail')!;
    this.loadProviderByEmail(this.providerEmail);
  }

 loadProviderByEmail(email: string) {
  this.serviceproviderService.getProviderByEmail(email).subscribe(data => {
    this.editForm.patchValue(data);
    console.log('Data from DB:', data);

    // Use the correct field name:
    if (data.profilePicture) {
      console.log('Found profilePicture in data');
      this.profileImageUrl = 'data:image/jpeg;base64,' + data.profilePicture;
    } else {
      console.log('No profilePicture found');
    }
  }, error => {
    console.error('Error loading provider data', error);
  });
}

  onFileChange(event: any) {
    this.selectedFile = event.target.files?.[0] ?? null;
  }

onSubmit() {
  const formValues = this.editForm.value;

  if (!this.providerId) {
    console.error('Provider ID is missing.');
    return;
  }

  const formData = new FormData();
  formData.append('data', new Blob([JSON.stringify(formValues)], { type: 'application/json' }));
  
  if (this.selectedFile) {
    formData.append('image', this.selectedFile);
  }

  this.serviceproviderService.updateProvider(this.providerId, formData).subscribe({
    next: (response) => {
      alert('Prpfile updated successfully!');
      console.log('Update successful', response);
    },
    error: (err) => {
      console.error('Update failed', err);
    }
  });
}



  logout() {
  localStorage.removeItem('providerEmail');
  this.router.navigate(['/loginserviceprovider']);
}

}