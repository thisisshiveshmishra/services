import { Component } from '@angular/core';
import { ServiceProviderService } from 'src/app/services/service-provider.service';
import { AdminService } from 'src/app/services/admin.service';
import { FeedbackService } from 'src/app/services/feedback.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {
   showSection = '';         // For toggling visibility (optional if you're using activeSection only)
  activeSection = 'providers'; // Default section to show
  providers: any[] = [];
  feedbacks: any[] = [];
  message = '';
  serviceRequests: any[] = [];

  constructor(
    private service: ServiceProviderService,
    private feedbackService: FeedbackService,
    private adminService: AdminService // ✅ Inject AdminService
  ) {}

  setActiveSection(section: string): void {
    this.activeSection = section;
  }

  ngOnInit(): void {
    this.loadProviders();
    this.loadFeedbacks();
    this.fetchAllServiceRequests();
  }

  loadProviders() {
    this.service.getAllProviders().subscribe({
      next: (data) => this.providers = data,
      error: () => this.message = 'Failed to load service providers.'
    });
  }

  loadFeedbacks() {
    this.feedbackService.getAllFeedback().subscribe({
      next: (data) => this.feedbacks = data,
      error: () => this.message = 'Failed to load feedback.'
    });
  }

  approve(id: number) {
    this.service.approveProvider(id).subscribe({
      next: () => {
        this.message = 'Provider approved successfully.';
        this.loadProviders();
      },
      error: () => this.message = 'Approval failed.'
    });
  }

  fetchAllServiceRequests() {
    this.adminService.getAllServiceRequests().subscribe({
      next: (res) => this.serviceRequests = res,
      error: (err) => {
        console.error('Error fetching service requests', err);
        this.message = 'Failed to load service requests.';
      }
    });
  }
}
