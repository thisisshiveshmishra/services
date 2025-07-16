import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ServiceRequest } from 'src/app/model/service-request';
import { ServiceProviderService } from 'src/app/services/service-provider.service';
import { ServiceRequestServiceService } from 'src/app/services/service-request-service.service';

@Component({
  
  selector: 'app-servicerequest',
  templateUrl: './servicerequest.component.html',
  styleUrls: ['./servicerequest.component.css']
})
export class ServicerequestComponent {
  
  serviceRequestForm!: FormGroup;
  requests: ServiceRequest[] = [];
  selectedRequest?: ServiceRequest;
  message = '';
  categories: string[] = [];
    showCustomCategoryInput = false; // ✅ Track other category input visibility




  constructor(
    private router: Router,
    private fb: FormBuilder,
    private serviceRequestService: ServiceRequestServiceService,
    private serviceprovider: ServiceProviderService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadAllRequests();
      this.loadCategoriesFromServiceProviders(); // ✅ new method

  }

initForm(): void {
  this.serviceRequestForm = this.fb.group({
    name: ['', [
      Validators.required,
      Validators.pattern(/^[A-Za-z ]{2,30}$/),
      Validators.maxLength(30)
    ]],
    surname: ['', [
      Validators.required,
      Validators.pattern(/^[A-Za-z ]{2,30}$/),
      Validators.maxLength(30)
    ]],
    contactNumber: ['', [
      Validators.required,
      Validators.pattern(/^[6-9]\d{9}$/)
    ]],
    email: ['', [
      Validators.required,
      Validators.email,
      Validators.maxLength(100)
    ]],
    gender: ['', Validators.required],
    location: ['', [
      Validators.required,
      Validators.pattern(/^[A-Za-z0-9 ,.-]{2,100}$/)
    ]],
    category: ['', Validators.required],
    customCategory: [''], // Will be required conditionally
    query: ['', [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(500)
    ]]
  });
}

  loadCategoriesFromServiceProviders(): void {
  this.serviceprovider.getAllProviders().subscribe({
    next: (providers) => {
      // Extract unique categories
      const uniqueCategories = Array.from(
        new Set(providers.map(p => p.category).filter(Boolean))
      );

      this.categories = uniqueCategories;
    },
    error: (err) => {
      console.error('Error loading service providers', err);
    }
  });
}

 onCategoryChange(event: Event): void {
  const selectElement = event.target as HTMLSelectElement;
  const isOther = selectElement.value === 'Other';
  this.showCustomCategoryInput = isOther;
 
  const customCatControl = this.serviceRequestForm.get('customCategory');
  if (isOther) {
    customCatControl?.setValidators([
      Validators.required,
      Validators.pattern(/^[A-Za-z0-9 ]{3,50}$/)
    ]);
  } else {
    customCatControl?.clearValidators();
    customCatControl?.reset();
  }
  customCatControl?.updateValueAndValidity();
} 
  navigate(){
    this.router.navigate(['/']);
  }

onSubmit(): void {
  if (this.serviceRequestForm.invalid) {
    this.message = 'Please fix errors in the form.';
    return;
  }

  const newRequest: ServiceRequest = { ...this.serviceRequestForm.value };
  const customCategory = this.serviceRequestForm.get('customCategory')?.value;

  // ✅ Use customCategory if 'Other' is selected
  if (newRequest.category === 'Other' && customCategory) {
    newRequest.category = customCategory;
  }

  // ✅ Delete the extra property before submission
  delete (newRequest as any).customCategory;

  this.serviceRequestService.createServiceRequest(newRequest).subscribe({
    next: (res) => {
      this.message = `Service request created with ID: ${res.id}`;
      alert('✅ Service request submitted successfully!');
      this.serviceRequestForm.reset();
      this.loadAllRequests();
    },
    error: (err) => {
      alert('❌ Failed to submit request. Please try again.');
      this.message = `Error creating request: ${err.message}`;
    }
  });
}


  // Load all service requests
  loadAllRequests(): void {
    this.serviceRequestService.getAllRequests().subscribe({
      next: (data) => {
        this.requests = data;
        this.message = `Loaded ${data.length} requests.`;
      },
      error: (err) => {
        this.message = `Error loading requests: ${err.message}`;
      }
    });
  }

  // Update service request by ID
  updateRequest(id: number): void {
    if (!this.selectedRequest) {
      this.message = 'Select a request first to update';
      return;
    }
    this.serviceRequestService.updateServiceRequest(id, this.selectedRequest).subscribe({
      next: (res) => {
        this.message = `Request with ID ${id} updated`;
        this.loadAllRequests();
      },
      error: (err) => {
        this.message = `Error updating request: ${err.message}`;
      }
    });
  }

  // Get request by ID
  getRequestById(id: number): void {
    this.serviceRequestService.getRequestById(id).subscribe({
      next: (res) => {
        this.selectedRequest = res;
        this.message = `Request with ID ${id} loaded`;
      },
      error: (err) => {
        this.message = `Request with ID ${id} not found`;
        this.selectedRequest = undefined;
      }
    });
  }

  // Get requests by Name
  getRequestByName(name: string): void {
    this.serviceRequestService.getRequestByName(name).subscribe({
      next: (res) => {
        this.requests = res;
        this.message = `Found ${res.length} requests with name "${name}"`;
      },
      error: (err) => {
        this.message = `No requests found with name "${name}"`;
        this.requests = [];
      }
    });
  }

  // Get request by Email
  getRequestByEmail(email: string): void {
    this.serviceRequestService.getRequestByEmail(email).subscribe({
      next: (res) => {
        this.selectedRequest = res;
        this.message = `Request with email ${email} loaded`;
      },
      error: (err) => {
        this.message = `No request found with email ${email}`;
        this.selectedRequest = undefined;
      }
    });
  }

  // Delete request by ID
  deleteRequest(id: number): void {
    this.serviceRequestService.deleteRequest(id).subscribe({
      next: () => {
        this.message = `Request with ID ${id} deleted`;
        this.loadAllRequests();
      },
      error: (err) => {
        this.message = `Error deleting request: ${err.message}`;
      }
    });
  }

  // Helper to populate selectedRequest for update, e.g. called from UI click
  selectRequest(request: ServiceRequest): void {
    this.selectedRequest = { ...request };  // shallow copy
    // Optionally populate form to edit
    this.serviceRequestForm.patchValue(this.selectedRequest);
  }
}