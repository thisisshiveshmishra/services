import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceProviderService } from 'src/app/services/service-provider.service';
import { AdminService } from 'src/app/services/admin.service';
import { FeedbackService } from 'src/app/services/feedback.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {
  activeSection = 'providers';
  providers: any[] = [];
  filteredProviders: any[] = [];
  feedbacks: any[] = [];
  serviceRequests: any[] = [];
  filteredRequests: any[] = [];
  message = '';

  // Filters
  providerNameFilter = '';
  providerLocationFilter = '';
  providerCategoryFilter = '';
  requestLocationFilter = '';
  requestCategoryFilter = '';

  // Loader tracking per provider
  loadingProviderIds: { [key: number]: boolean } = {};

  constructor(
    private router: Router,
    private service: ServiceProviderService,
    private feedbackService: FeedbackService,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.loadProviders();
    this.loadFeedbacks();
    this.fetchAllServiceRequests();
  }

  setActiveSection(section: string): void {
    this.activeSection = section;
    this.message = '';
  }

  loadProviders() {
    this.service.getAllProviders().subscribe({
      next: (data) => {
        this.providers = data;
        this.providers.forEach(p => {
          this.loadingProviderIds[p.id] = false; // default: no loader
        });
        this.filterProviders();
      },
      error: (err) => {
        console.error('Failed to load providers:', err);
        this.message = 'Failed to load service providers.';
      }
    });
  }

  loadFeedbacks() {
    this.feedbackService.getAllFeedback().subscribe({
      next: (data) => (this.feedbacks = data),
      error: () => (this.message = 'Failed to load feedback.')
    });
  }

  approve(id: number) {
    this.loadingProviderIds[id] = true;
    this.service.approveProvider(id).subscribe({
      next: () => {
        this.message = 'Provider approved successfully.';
        this.loadingProviderIds[id] = false;
        this.loadProviders();
      },
      error: () => {
        this.message = 'Approval failed.';
        this.loadingProviderIds[id] = false;
      }
    });
  }

  reject(id: number) {
    this.loadingProviderIds[id] = true;
    this.service.rejectProvider(id).subscribe({
      next: () => {
        this.message = 'Provider rejected successfully.';
        const provider = this.providers.find(p => p.id === id);
        if (provider) {
          provider.rejected = true;
          provider.approved = false;
        }
        this.loadingProviderIds[id] = false;
        this.filterProviders();
      },
      error: () => {
        this.message = 'Rejection failed.';
        this.loadingProviderIds[id] = false;
      }
    });
  }

  fetchAllServiceRequests() {
    this.adminService.getAllServiceRequests().subscribe({
      next: (res) => {
        this.serviceRequests = res;
        this.filterRequests();
      },
      error: (err) => {
        console.error('Error fetching service requests:', err);
        this.message = 'Failed to load service requests.';
      }
    });
  }

  filterProviders() {
    this.filteredProviders = this.providers.filter(p =>
      (!this.providerNameFilter || (p.firstName + ' ' + p.lastName).toLowerCase().includes(this.providerNameFilter.toLowerCase())) &&
      (!this.providerLocationFilter || p.location?.toLowerCase().includes(this.providerLocationFilter.toLowerCase())) &&
      (!this.providerCategoryFilter || p.category?.toLowerCase().includes(this.providerCategoryFilter.toLowerCase()))
    );
  }

  filterRequests() {
    this.filteredRequests = this.serviceRequests.filter(r =>
      (!this.requestLocationFilter || r.location?.toLowerCase().includes(this.requestLocationFilter.toLowerCase())) &&
      (!this.requestCategoryFilter || r.category?.toLowerCase().includes(this.requestCategoryFilter.toLowerCase()))
    );
  }

  logout() {
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/adminlogin']);
  }

  getStars(rating: number): boolean[] {
    return Array(5).fill(false).map((_, i) => i < rating);
  }
}