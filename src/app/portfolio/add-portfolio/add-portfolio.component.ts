import { Component, OnInit,Output, EventEmitter } from '@angular/core';
import { FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  FormArray } from '@angular/forms';
import { PortfolioDataService } from '../portfolio-data.service';
import { Portfolio } from '../data-types/portfolio';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AuthenticationService } from '../../user/authentication.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-add-portfolio',
  templateUrl: './add-portfolio.component.html',
  styleUrls: ['./add-portfolio.component.css']
})
export class AddPortfolioComponent implements OnInit {

  public portfolio: FormGroup;
  public loggedInUser$ = this._authenticationService.user$;

  constructor(
    private fb: FormBuilder,
    private _portfolioDataService: PortfolioDataService,
    private _authenticationService: AuthenticationService,
    private router: Router
    ) { }

  ngOnInit() {
    this.portfolio = this.fb.group({
      pName: ['', [Validators.required, Validators.minLength(2)]],
      description:['', [Validators.required, Validators.minLength(10)]],
      picturePath:['', [Validators.required, Validators.minLength(10)]],
      resumePath:['', [Validators.required, Validators.minLength(10)]]
    });

  }

  onSubmit(){

   this._portfolioDataService
    .addNewPortfolio(this.loggedInUser$.value,
      { 
        name: this.portfolio.value.pName,
        description: this.portfolio.value.description,
        picturePath: this.portfolio.value.picturePath,
        resumePath: this.portfolio.value.resumePath
      } as Portfolio).subscribe();
  
    this.router.navigate(['portfolio/view']);
    // router.navigatebyurl kan je ook gebruiken
  }

  getErrorMessage(errors: any) {
    if (!errors) {
      return null;
    }
    if (errors.required) {
      return 'is required';
    } else if (errors.minlength) {
      return `needs at least ${
        errors.minlength.requiredLength
      } characters (got ${errors.minlength.actualLength})`;
    } else if (errors.amountNoName) {
      return `if amount is set you must set a name`;
    }
  }

}
