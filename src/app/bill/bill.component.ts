import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.scss']
})
export class BillComponent implements OnInit {

  billForm = this.formBuilder.group({
    cost:0,
    coupon1:'',
  })

  constructor(
    private formBuilder:FormBuilder,
  ) { }

  onSubmit(){

  }

  ngOnInit(): void {
  }

}
