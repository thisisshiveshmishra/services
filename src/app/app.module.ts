import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomepageComponent } from './components/homepage/homepage.component';

import { ServiceProviderComponent } from './components/service-provider/service-provider.component';
import { LoginserviceProviderComponent } from './components/loginservice-provider/loginservice-provider.component';
import { RegisterserviceProviderComponent } from './components/registerservice-provider/registerservice-provider.component';
import { ServicerequestComponent } from './components/servicerequest/servicerequest.component';
import { ServiceproviderdashboardComponent } from './components/serviceproviderdashboard/serviceproviderdashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AdminLoginComponent } from './components/adminlogin/adminlogin.component';
import { SearchbarComponent } from './components/searchbar/searchbar.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';



@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
   ServiceProviderComponent,
   LoginserviceProviderComponent,
   RegisterserviceProviderComponent,
   ServicerequestComponent,
   ServiceproviderdashboardComponent,
   AdminDashboardComponent,
   AdminLoginComponent,
   SearchbarComponent,
   ResetPasswordComponent,
   



  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
