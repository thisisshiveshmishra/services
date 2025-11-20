import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomepageComponent } from './components/homepage/homepage.component';

import { ServiceProviderComponent } from './components/service-provider/service-provider.component';
import { LoginserviceProviderComponent } from './components/loginservice-provider/loginservice-provider.component';
import { RegisterserviceProviderComponent } from './components/registerservice-provider/registerservice-provider.component';
import { ServicerequestComponent } from './components/servicerequest/servicerequest.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AdminLoginComponent } from './components/adminlogin/adminlogin.component';
import { SearchbarComponent } from './components/searchbar/searchbar.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { MessageComponent } from './components/message/message.component';
import { UserloginComponent } from './components/userlogin/userlogin.component';
import { UserregisterComponent } from './components/userregister/userregister.component';
import { ChatComponent } from './components/chat/chat.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { ServiceproviderdashboardComponent } from './components/serviceproviderdashboard/serviceproviderdashboard.component';
import { FooterComponent } from './components/footer/footer.component';
import { SafeUrlPipe } from './pipe/safe-url.pipe';
import { CareerComponent } from './components/career/career.component';
import { ContactComponent } from './components/contact/contact.component';

import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { TermsconditionComponent } from './components/termscondition/termscondition.component';
import { FaqComponent } from './components/faq/faq.component';
import { SolutionsComponent } from './components/solutions/solutions.component';
import { MaintenanceComponent } from './components/maintenance/maintenance.component';




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
   MessageComponent,
   UserloginComponent,
   UserregisterComponent,
   ChatComponent,
   ForgotpasswordComponent,
   FooterComponent,
   SafeUrlPipe,
   CareerComponent,
   ContactComponent,
   PrivacyPolicyComponent,
   TermsconditionComponent,
   FaqComponent,
   SolutionsComponent,
   MaintenanceComponent
  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
