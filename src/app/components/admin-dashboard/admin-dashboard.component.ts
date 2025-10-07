import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceProviderService } from 'src/app/services/service-provider.service';
import { AdminService } from 'src/app/services/admin.service';
import { FeedbackService } from 'src/app/services/feedback.service';
import { debounceTime, Subject } from 'rxjs';

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
  selectedDescription: string | null = null;
  selectedFeedbackMessage: string | null = null;
  selectedRequestQuery: string | null = null;

  // Loader tracking per provider
  loadingProviderIds: { [key: number]: boolean } = {};

  // Debounce subjects
  private providerFilterSubject = new Subject<void>();
  private requestFilterSubject = new Subject<void>();

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

    // Debounce setup
    this.providerFilterSubject.pipe(debounceTime(300)).subscribe(() => {
      this.applyProviderFilters();
    });

    this.requestFilterSubject.pipe(debounceTime(300)).subscribe(() => {
      this.applyRequestFilters();
    });
  }

  setActiveSection(section: string): void {
    this.activeSection = section;
    this.message = '';
  }

  /* ----------------- Providers ----------------- */
  loadProviders() {
    this.service.getAllProviders().subscribe({
      next: (data) => {
        this.providers = data;
        this.providers.forEach(p => {
          this.loadingProviderIds[p.id] = false;
        });
        this.applyProviderFilters();
      },
      error: (err) => {
        console.error('Failed to load providers:', err);
        this.message = 'Failed to load service providers.';
      }
    });
  }

  approve(id: number) {
  this.loadingProviderIds[id] = true;
  this.service.approveProvider(id).subscribe({
    next: (res) => {
      this.loadingProviderIds[id] = false;
      alert('✅ ' + res); // Shows backend message
      window.location.reload(); // Refresh page for new status
    },
    error: (err) => {
      this.loadingProviderIds[id] = false;
      alert('❌ Failed to approve provider.\n' + err.message);
    }
  });
}

reject(id: number) {
  this.loadingProviderIds[id] = true;
  this.service.rejectProvider(id).subscribe({
    next: (res) => {
      this.loadingProviderIds[id] = false;
      alert('🚫 ' + res); // Shows backend message
      window.location.reload();
    },
    error: (err) => {
      this.loadingProviderIds[id] = false;
      alert('❌ Failed to reject provider.\n' + err.message);
    }
  });
}


  filterProviders(): void {
    this.providerFilterSubject.next();
  }

  private applyProviderFilters(): void {
    this.filteredProviders = this.providers.filter(p =>
      (!this.providerNameFilter || (p.firstName + ' ' + p.lastName).toLowerCase().includes(this.providerNameFilter.toLowerCase())) &&
      (!this.providerLocationFilter || p.location?.toLowerCase().includes(this.providerLocationFilter.toLowerCase())) &&
      (!this.providerCategoryFilter || p.category?.toLowerCase().includes(this.providerCategoryFilter.toLowerCase()))
    );
  }

  /* ----------------- Feedback ----------------- */
  loadFeedbacks() {
    this.feedbackService.getAllFeedback().subscribe({
      next: (data) => (this.feedbacks = data),
      error: () => (this.message = 'Failed to load feedback.')
    });
  }

  /* ----------------- Requests ----------------- */
  fetchAllServiceRequests() {
    this.adminService.getAllServiceRequests().subscribe({
      next: (res) => {
        this.serviceRequests = res;
        this.applyRequestFilters();
      },
      error: (err) => {
        console.error('Error fetching service requests:', err);
        this.message = 'Failed to load service requests.';
      }
    });
  }

  filterRequests(): void {
    this.requestFilterSubject.next();
  }

  private applyRequestFilters(): void {
    this.filteredRequests = this.serviceRequests.filter(r =>
      (!this.requestLocationFilter || r.location?.toLowerCase().includes(this.requestLocationFilter.toLowerCase())) &&
      (!this.requestCategoryFilter || r.category?.toLowerCase().includes(this.requestCategoryFilter.toLowerCase()))
    );
  }

  /* ----------------- Common ----------------- */
  logout() {
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/adminlogin']);
  }

  getStars(rating: number): boolean[] {
    return Array(5).fill(false).map((_, i) => i < rating);
  }

  openDescription(desc: string) {
    this.selectedDescription = desc;
  }

  closeDescription() {
    this.selectedDescription = null;
  }

  openFeedbackMessage(msg: string) {
    this.selectedFeedbackMessage = msg;
  }

  closeFeedbackMessage() {
    this.selectedFeedbackMessage = null;
  }

  openRequestQuery(query: string) {
    this.selectedRequestQuery = query;
  }

  closeRequestQuery() {
    this.selectedRequestQuery = null;
  }
}
