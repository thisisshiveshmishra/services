import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { AdminLoginComponent } from './adminlogin/adminlogin.component';
import { AdminRegisterComponent } from './adminregister/adminregister.component';
import { ServiceProviderComponent } from './service-provider/service-provider.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { LoginserviceProviderComponent } from './loginservice-provider/loginservice-provider.component';
import { RegisterserviceProviderComponent } from './registerservice-provider/registerservice-provider.component';


const routes: Routes = [
    { path: '', component: HomepageComponent },
    {path: 'adminlogin', component: AdminLoginComponent},
    {path: 'adminregister', component: AdminRegisterComponent},
    {path: 'serviceprovider', component: ServiceProviderComponent},
    {path: 'admindashboard', component: AdminDashboardComponent},
    {path: 'loginserviceprovider', component: LoginserviceProviderComponent},
    {path: 'registerserviceprovider', component: RegisterserviceProviderComponent},
    

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
