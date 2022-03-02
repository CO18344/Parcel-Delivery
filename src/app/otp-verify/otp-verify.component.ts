import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-otp-verify',
  templateUrl: './otp-verify.component.html',
  styleUrls: ['./otp-verify.component.scss']
})
export class OtpVerifyComponent implements OnInit {

  mobile!:string | null 
  mobileAlert!:string

  otpVerifyForm = this.formBuilder.group({
    otp:''
  });

  constructor(
    private users:UserService,
    private route:ActivatedRoute,
    private formBuilder:FormBuilder,
    private router:Router,
  ) { }

  onSubmit(){
    let otpPackage = this.otpVerifyForm.value
    otpPackage.phone = this.mobile
    this.users.
      verifyOtp(otpPackage)
      .subscribe(
        {
          complete: ()=>{
            console.log('Otp Verified')
            this.router.navigateByUrl('/login')
          },
          error: (err)=>{
            console.log('Otp mismatch');
          }
        }
      );
    
  }
  ngOnInit(): void {
    // console.log('Loaded')
    this.mobile = localStorage.getItem('mobileReadOnly')
    this.mobileAlert = this.users.getReadOnlyMobile()
    // const productIdFromRoute = Number(routeParams.get('productId'));
  }

 

}
