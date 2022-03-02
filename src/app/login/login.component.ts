import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { UserService } from '../user.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  
  loginForm = this.formBuilder.group({
    email:'',
    passwd:''
  });

  constructor(
    private formBuilder:FormBuilder,
    private http:HttpClient,
    // private route:ActivatedRoute,
    private router:Router,
    private users:UserService,
  ) { }

  onSubmit(){
   let user = this.loginForm.value
   console.log(user)
    this.users.
      authenticateUser(user)
      .subscribe(
        {
          
          // complete: ()=>{
          //   console.log('Sucess');
          //   // for readonly field
          //   this.router.navigateByUrl('/home')
          // },
          complete:()=>{
            console.log('done')
          },
          error: (err)=>{
            console.log('Error');
          },
          next: (res)=>{
            console.log('res: ',res)
            localStorage.setItem('token',res.token);
            localStorage.setItem('email',res.email);
            this.router.navigateByUrl('/home')
          }
        }
      );
  }
  ngOnInit(): void {
  }

}
