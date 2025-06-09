import { Component } from '@angular/core';
import { ServiceProviderService } from 'src/app/services/service-provider.service';


@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {
  providers: any[] = [];
    message = '';
   
    constructor(private service: ServiceProviderService) {}
   
    ngOnInit(): void {
      this.loadProviders();
    }
   
    loadProviders() {
      this.service.getAllProviders().subscribe({
        next: (data) => this.providers = data,
        error: () => this.message = 'Failed to load service providers.'
      });
    }
   
    approve(id: number) {
      this.service.approveProvider(id).subscribe({
        next: () => {
          this.message = 'Provider approved successfully.';
          this.loadProviders(); // Refresh list after approval
        },
        error: () => this.message = 'Approval failed.'
      });
    }
  }


