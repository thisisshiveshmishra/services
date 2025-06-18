import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceRequest } from 'src/app/model/service-request';
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
    private serviceRequestService: ServiceRequestServiceService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadAllRequests();
  }

  initForm(): void {
    this.serviceRequestForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      surname: ['', [Validators.required, Validators.maxLength(50)]],
      contactNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      location: ['', Validators.required],
      category: [''],  // optional, add Validators.required if needed
      query: ['']      // transient field
    });
  }

  // Create new service request
  onSubmit(): void {
    if (this.serviceRequestForm.invalid) {
      this.message = 'Please fix errors in the form.';
      return;
    }
    const newRequest: ServiceRequest = this.serviceRequestForm.value;

    this.serviceRequestService.createServiceRequest(newRequest).subscribe({
      next: (res) => {
        this.message = `Service request created with ID: ${res.id}`;
        this.serviceRequestForm.reset();
        this.loadAllRequests();
      },
      error: (err) => {
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