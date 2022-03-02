import { Component, OnInit } from '@angular/core';

import { FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  constructor(
    private formBuilder:FormBuilder,
    private http:HttpClient,
    // private route:ActivatedRoute,
    private router:Router,
    private users:UserService,
  ) { }

  signupForm = this.formBuilder.group({
    fname: 'Satvik',
    lname: '',
    email:'temp@gmail.com',
    phone:'+917529916694',
    passwd:'Satvik234@',
   'passwd-confirm':'Satvik234@',
    country:'India',
    state:'Punjab',
    city:'DeraBassi',
    zip:'140507'
  });

  onSubmit(){
    let user = this.signupForm.value
    this.users.
      createUser(user)
      .subscribe(
        {
          complete: ()=>{
            console.log('Sucess');
            // for dismissable alert
            this.users.setMobileForOtp(user.phone)
  
            // for readonly field
            localStorage.setItem('mobileReadOnly',user.phone)
            this.router.navigateByUrl('/otp')
          },
          error: (err)=>{
            console.log('Error');
          }
        }
      );
    // this.signupForm.reset()
  }

  ngOnInit(): void {
    // const routeParams = this.route.snapshot.paramMap;

    // const productIdFromRoute = Number(routeParams.get('productId'));
  }

}
