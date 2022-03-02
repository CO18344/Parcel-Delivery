import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class OrderingService {

  constructor(
    private http:HttpClient,
  ) { }

  generateOrderId(){
    let user = {
      token:localStorage.getItem('token'),
      email:localStorage.getItem('email'),
    }
    return this.http.post<any>('http://127.0.0.1:3000/api/orders/generateOrderId',user)
  }
  saveOrder(order:any){

  }
}
