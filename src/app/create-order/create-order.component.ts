import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.scss']
})
export class CreateOrderComponent implements OnInit {

  orderForm = this.formBuilder.group({
    'order-name':'',
    'type':0,
    weight:'',
    length:'',
    'breadth':'',
    'alt-phone':'',
    'pic':'',
    'pickup-addr':'',
    "drop-addr":'',

  })

  constructor(
    private formBuilder:FormBuilder,
    private http:HttpClient,
    private cd:ChangeDetectorRef,
  ) { }


  onSubmit(){
    console.log(typeof this.orderForm.value.pic);
    console.log(this.orderForm.value.pic);
    
  }

  onFileSelected(event:any){
    const reader = new FileReader();
    const form = new FormData()
    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      let data= {
    
      }
      reader.onload = () => {
        this.orderForm.value.pic = reader.result;
        // console.log(this.orderForm.value.pic)

        // need to run CD since file load runs outside of zone
        this.http.post<any>('http://127.0.0.1:3000/api/orders/upload',this.orderForm.value).subscribe()
        this.cd.markForCheck();
      };
      
    }
  }
  

  ngOnInit(): void {
  }

}
