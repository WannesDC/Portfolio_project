import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Portfolio } from '../data-types/portfolio';
import { PortfolioDataService } from '../portfolio-data.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/user/authentication.service';
import { Contact } from '../data-types/contact';



@Component({
  selector: 'app-view-by-user',
  templateUrl: './view-by-user.component.html',
  styleUrls: ['./view-by-user.component.css']
})

export class ViewByUserComponent implements OnInit {

  public contact: FormGroup;
  portfolio$ : Observable<Portfolio>;
  
  


  constructor(private fb: FormBuilder,private _portfolioDataService : PortfolioDataService,
    private router:Router) { 

    }

  ngOnInit() {
    this.contact = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      surname:['', [Validators.required, Validators.minLength(2)]],
      email:['', [Validators.required, Validators.minLength(2)]],
      birthDate:['', [Validators.required, Validators.minLength(2)]],
      street:['', [Validators.required, Validators.minLength(2)]],
      city:['', [Validators.required, Validators.minLength(2)]],
      country:['', [Validators.required, Validators.minLength(2)]],
      postalCode:['', [Validators.required, Validators.minLength(2)]]
    });
    this.portfolio$=this._portfolioDataService.getPortfolioByUser$();
    this.portfolio$.pipe(tap(x => console.log(x)));
  }

  onSubmit(id:number){
    

    this._portfolioDataService.postContact(id,
    { 
      name: this.contact.value.name,
      surname: this.contact.value.surname,
      email: this.contact.value.email,
      birthDate: this.contact.value.birthDate,
      street: this.contact.value.street,
      city: this.contact.value.city,
      country: this.contact.value.country,
      postalcode: this.contact.value.postalCode
    } as Contact).subscribe();
  }

  delete(id:number){
    this._portfolioDataService.deletePortfolio(id);
   
    //this.router.navigate(['portfolio']);
  }
}
