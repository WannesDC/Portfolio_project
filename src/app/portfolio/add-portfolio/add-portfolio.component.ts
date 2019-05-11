import { Component, OnInit,Output, EventEmitter, Input } from '@angular/core';
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
import { HttpErrorResponse } from '@angular/common/http';



@Component({
  selector: 'app-add-portfolio',
  templateUrl: './add-portfolio.component.html',
  styleUrls: ['./add-portfolio.component.css']
})
export class AddPortfolioComponent implements OnInit {

  public portfolio: FormGroup;
  public loggedInUser$ = this._authenticationService.user$;
  public errorMsg: string;

  constructor(private router: Router,
    private fb: FormBuilder,
    private _portfolioDataService: PortfolioDataService,
    private _authenticationService: AuthenticationService
    ) { }

  ngOnInit() {
    const reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
    this.portfolio = this.fb.group({
      pName: ['', [Validators.required]],
      description:['', [Validators.required]],
      picturePath:['', [Validators.required, Validators.pattern(reg)]],
      resumePath:['', [Validators.required, Validators.pattern(reg)]]
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
      } as Portfolio).subscribe(
        val => {
          if (val) {
            if (this._portfolioDataService.redirectUrl) {
              this.router.navigateByUrl(this._portfolioDataService.redirectUrl);
              this._portfolioDataService.redirectUrl = undefined;
            } else {
              this.router.navigateByUrl('/RefreshComponent', {skipLocationChange: true}).then(()=>
    this.router.navigate(['']));
            }
          } else {
            this.errorMsg = `Could not add Portfolio`;
          }
        },
        (err: HttpErrorResponse) => {
          console.log(err);
          if (err.error instanceof Error) {
            this.errorMsg = `Error while trying to add portfolio ${
              this.portfolio.value.pName
            }: ${err.error.message}`;
          } else {
            this.errorMsg = `Error ${err.status} while trying to add portfolio ${
              this.portfolio.value.pName
            }: ${err.error}`;
          }
        }

      );
  
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
    } else if (errors.pattern) {
      return `You must provide an URL`;
    }
  }

  isValid(field: string) {
    const input = this.portfolio.get(field);
    return input.dirty && input.invalid;
  }

  fieldClass(field: string) {
    return { "is-invalid": this.isValid(field) };
  }

}
