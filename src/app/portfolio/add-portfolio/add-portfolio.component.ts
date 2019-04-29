import { Component, OnInit,Output, EventEmitter } from '@angular/core';
import { FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  FormArray } from '@angular/forms';
import { PortfolioDataService } from '../portfolio-data.service';
import { Portfolio } from '../portfolio.model';
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
    //console.log(this.loggedInUser$);
    this._portfolioDataService
    .addNewPortfolio(this.loggedInUser$.value,new Portfolio(this.portfolio.value.pName, this.portfolio.value.description, this.portfolio.value.picturePath, this.portfolio.value.resumePath))
    .subscribe();
    this.router.navigate(['portfolio/view']);
    // router.navigatebyurl kan je ook gebruiken, zou graag portfolio resolver willen gebruiken. Maar hoe? 
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
