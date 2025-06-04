import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomepageComponent } from './homepage/homepage.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AdminLoginComponent } from './adminlogin/adminlogin.component';
import { AdminRegisterComponent } from './adminregister/adminregister.component';
import { ServiceProviderComponent } from './service-provider/service-provider.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { LoginserviceProviderComponent } from './loginservice-provider/loginservice-provider.component';
import { RegisterserviceProviderComponent } from './registerservice-provider/registerservice-provider.component';




@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    AdminLoginComponent,
    AdminRegisterComponent,
   ServiceProviderComponent,
   AdminDashboardComponent,
   LoginserviceProviderComponent,
   RegisterserviceProviderComponent
   
    
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
