import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

// Modules
import { AppRoutingModule } from './app-routing.module';
import { Routes, RouterModule } from '@angular/router'
import { HttpClientModule } from '@angular/common/http'
import { ReactiveFormsModule } from '@angular/forms';

//Components
import { AppComponent } from './app.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { TestComponent } from './test/test.component';
import { SubNavComponent } from './sub-nav/sub-nav.component';
import { CreateOrderComponent } from './create-order/create-order.component';
import { BillComponent } from './bill/bill.component';
import { PaymentComponent } from './payment/payment.component';
import { SuccessComponent } from './success/success.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { OtpVerifyComponent } from './otp-verify/otp-verify.component';


const routes:Routes = [
  {
    path:'',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path:'login',
    component: LoginComponent
  },
  {
    path:'signup',
    component:SignupComponent
  },
  {
    path:'otp',
    component:OtpVerifyComponent
  },
  {
    path:'home',
    component: HomeComponent,
  },
  {
    path: 'orders/:id',
    component: PageNotFoundComponent
  },
  {
    path: 'orders/:id',
    component: SubNavComponent,
    children:[
      {
        path: 'create',
        component:CreateOrderComponent
      },
      {
        path: 'bill',
        component: BillComponent
      },
      {
        path: 'payment',
        component: PaymentComponent
      },
      {
        path: 'success',
        component: SuccessComponent
      }
    ]
  },
  {
    path:'**',
    redirectTo: 'home',
    pathMatch: 'full'
  }
  // {
  //   path:'orders/:id',
  //   component: OrderComponent,
  //   children:[
  //     {
  //       path:'create',
  //       component
  //     }
  //   ]
  // }
]
@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    HomeComponent,
    PageNotFoundComponent,
    TestComponent,
    SubNavComponent,
    BillComponent,
    PaymentComponent,
    SuccessComponent,
    LoginComponent,
    SignupComponent,
    OtpVerifyComponent,
    CreateOrderComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent],

})
export class AppModule { }
