export interface User {
    fname: string,
    lname: string,
    email: string,
    phone: string,
    passwd: string,
   'passwd-confirm':string,
    country: string,
    state:string,
    city:string,
    zip:number,
}

export interface Otp {
    phone:string,
    otp:string
}

export interface Order{
    
}
