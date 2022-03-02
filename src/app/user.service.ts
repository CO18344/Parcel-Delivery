import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User,Otp } from './interfaces';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  mobileReadOnly!:string
  constructor(
    private http:HttpClient,
  ) { }

  createUser(user:User){
    return this.http.post<any>('http://127.0.0.1:3000/api/users/create',user)    
  }

  authenticateUser(user:any){
    return this.http.post<any>('http://127.0.0.1:3000/api/users/login',user)
  }
  verifyOtp(otpPackage:Otp){
    return this.http.post<any>('http://127.0.0.1:3000/api/users/activate',otpPackage)
  }

  setMobileForOtp(mobile:string){
    this.mobileReadOnly = mobile
  }

  getReadOnlyMobile(){
    return this.mobileReadOnly;
  }
}
