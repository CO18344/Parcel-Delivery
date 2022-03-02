import { Component, OnInit } from '@angular/core';
import { OrderingService } from '../ordering.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

  constructor(
    private orderService:OrderingService,
    private router:Router,
  ) { }

  createNew(){
    this.orderService.generateOrderId()
    .subscribe({
      next:(data)=>{
        this.router.navigateByUrl(`/orders/${data.orderId}/create`)
      }
    })
  }

  ngOnInit(): void {
  }

}
