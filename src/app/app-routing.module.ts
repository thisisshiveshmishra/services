import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AdminLoginComponent } from './components/adminlogin/adminlogin.component';
import { AdminRegisterComponent } from './components/adminregister/adminregister.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { LoginserviceProviderComponent } from './components/loginservice-provider/loginservice-provider.component';
import { RegisterserviceProviderComponent } from './components/registerservice-provider/registerservice-provider.component';
import { ServiceProviderComponent } from './components/service-provider/service-provider.component';
import { ServiceproviderdashboardComponent } from './components/serviceproviderdashboard/serviceproviderdashboard.component';
import { ServicerequestComponent } from './components/servicerequest/servicerequest.component';
import { DummyComponent } from './components/dummy/dummy.component';

const routes: Routes = [
    { path: '', component: HomepageComponent },
    {path: 'adminlogin', component: AdminLoginComponent},
    {path: 'adminregister', component: AdminRegisterComponent},
    {path: 'serviceprovider', component: ServiceProviderComponent},
    {path: 'admindashboard', component: AdminDashboardComponent},
    {path: 'loginserviceprovider', component: LoginserviceProviderComponent},
    {path: 'registerserviceprovider', component: RegisterserviceProviderComponent},
    {path: 'servicerequest', component: ServicerequestComponent},
    {path: 'dashboardserviceprovider', component: ServiceproviderdashboardComponent},
    {path: 'dummy', component: DummyComponent},
    
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
