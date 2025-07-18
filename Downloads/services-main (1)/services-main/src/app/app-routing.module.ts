import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AdminLoginComponent } from './components/adminlogin/adminlogin.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { LoginserviceProviderComponent } from './components/loginservice-provider/loginservice-provider.component';
import { RegisterserviceProviderComponent } from './components/registerservice-provider/registerservice-provider.component';
import { ServiceProviderComponent } from './components/service-provider/service-provider.component';
import { ServiceproviderdashboardComponent } from './components/serviceproviderdashboard/serviceproviderdashboard.component';
import { ServicerequestComponent } from './components/servicerequest/servicerequest.component';
import { SearchbarComponent } from './components/searchbar/searchbar.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { authGuard } from './services/auth.guard'; 


const routes: Routes = [
    { path: '', component: HomepageComponent },
    {path: 'adminlogin', component: AdminLoginComponent},

    {path: 'serviceprovider', component: ServiceProviderComponent},
    {
  path: 'admindashboard',
  component: AdminDashboardComponent,
  canActivate: [authGuard]
  
},

    {path: 'loginserviceprovider', component: LoginserviceProviderComponent},
    {path: 'registerserviceprovider', component: RegisterserviceProviderComponent},
    {path: 'servicerequest', component: ServicerequestComponent},
    {path: 'dashboardserviceprovider', component: ServiceproviderdashboardComponent},
    {path:'searchservices',component:SearchbarComponent},
    {path: 'resetpassword',component: ResetPasswordComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
