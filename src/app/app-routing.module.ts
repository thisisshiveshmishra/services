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
import { MessageComponent } from './components/message/message.component';
import { UserloginComponent } from './components/userlogin/userlogin.component';
import { UserregisterComponent } from './components/userregister/userregister.component';
import { ChatComponent } from './components/chat/chat.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { FooterComponent } from './components/footer/footer.component';
import { serviceproviderguardGuard } from './services/serviceproviderguard.guard';
import { CareerComponent } from './components/career/career.component';
import { ContactComponent } from './components/contact/contact.component';

import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { TermsconditionComponent } from './components/termscondition/termscondition.component';
import { FaqComponent } from './components/faq/faq.component';
import { SolutionsComponent } from './components/solutions/solutions.component';
import { MaintenanceComponent } from './components/maintenance/maintenance.component';



const routes: Routes = [
    {path: '', component: HomepageComponent},
    {path: 'adminlogin', component: AdminLoginComponent},
    {path: 'feedback', component: ServiceProviderComponent},
    {path: 'admindashboard', component: AdminDashboardComponent, canActivate: [authGuard]},
    {path: 'loginserviceprovider', component: LoginserviceProviderComponent},
    {path: 'registerserviceprovider', component: RegisterserviceProviderComponent},
    {path: 'servicerequest', component: ServicerequestComponent},
    {path: 'dashboardserviceprovider', component: ServiceproviderdashboardComponent,canActivate: [serviceproviderguardGuard]},
    {path:'searchservices',component:SearchbarComponent},
    {path: 'resetpassword',component: ResetPasswordComponent},
    {path: 'message/:id',component: MessageComponent},
    {path: 'userlogin',component: UserloginComponent},
    {path: 'userregister',component: UserregisterComponent},
    { path: 'chat', component: ChatComponent  },
    {path: 'forgotpassword',component:ForgotpasswordComponent},
    { path: 'footer', component: FooterComponent  },
    {path: 'career',component : CareerComponent},
    {path: 'contact',component : ContactComponent},
    {path: 'privacypolicy',component : PrivacyPolicyComponent},
    {path:'termscondition', component: TermsconditionComponent},
    {path:'faq', component: FaqComponent},
    {path: 'solutions', component: SolutionsComponent },
    {path: 'maintenance', component: MaintenanceComponent },


    

];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
