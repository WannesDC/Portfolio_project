import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../user/authentication.service';
import { Portfolio } from '../data-types/portfolio';
import { PortfolioDataService } from '../portfolio-data.service';

@Component({
  selector: 'app-add-portfolio',
  templateUrl: './add-portfolio.component.html',
  styleUrls: ['./add-portfolio.component.css']
})
export class AddPortfolioComponent implements OnInit {
  public portfolio: FormGroup;
  public loggedInUser$ = this._authenticationService.user$;
  public errorMsg: string;

  public isFileChosen: boolean;
  public fileName: string;

  public isFileChosen2: boolean;
  public fileName2: string;

  public Image: File;
  public Resume: File;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private _portfolioDataService: PortfolioDataService,
    private _authenticationService: AuthenticationService
  ) {}

  ngOnInit() {
    this.portfolio = this.fb.group({
      pName: ['', [Validators.required]],
      description: ['', [Validators.required]],
      picturePath: ['', [Validators.required]],
      resumePath: ['', [Validators.required]]
    });
  }

  onSubmit() {
    this._portfolioDataService
      .addNewPortfolio(this.loggedInUser$.value, {
        name: this.portfolio.value.pName,
        description: this.portfolio.value.description
      } as Portfolio)
      .subscribe(
        (err: HttpErrorResponse) => {
          console.log(err);
          if (err.error instanceof Error) {
            this.errorMsg = `Error while trying to add portfolio ${
              this.portfolio.value.pName
            }: ${err.error.message}`;
          } else {
            this.errorMsg = `Error ${
              err.status
            } while trying to add portfolio ${this.portfolio.value.pName}: ${
              err.error
            }`;
          }
        }
      );

    const uploadImage = new FormData();
    uploadImage.append('file', this.Image, this.Image.name);
    const uploadResume = new FormData();
    uploadResume.append('file', this.Resume, this.Resume.name);

    this._portfolioDataService.postImage(uploadImage)
    .subscribe(
      (err: HttpErrorResponse) => {
        console.log(err);
        if (err.error instanceof Error) {
          this.errorMsg = `Error while trying to add Image: ${err.error.message}`;
        } else {
          this.errorMsg = `Error ${
            err.status
          } while trying to add Image: ${
            err.error
          }`;
        }
      }
    );
    this._portfolioDataService.postResume(uploadResume)
    .subscribe(
      val => {
        if (val) {
          if (this._portfolioDataService.redirectUrl) {
            this.router.navigateByUrl(this._portfolioDataService.redirectUrl);
            this._portfolioDataService.redirectUrl = undefined;
          } else {
            this.router
              .navigateByUrl('/RefreshComponent', {
                skipLocationChange: true
              })
              .then(() =>
                this.router.navigate(['/portfolio/main-portfolio'])
              );
          }
        } else {
          this.errorMsg = `Could not add Resume`;
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err);
        if (err.error instanceof Error) {
          this.errorMsg = `Error while trying to add Resume: ${err.error.message}`;
        } else {
          this.errorMsg = `Error ${
            err.status
          } while trying to add Resume: ${
            err.error
          }`;
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
      return `You must provide a valid file`;
    }
  }

  isValid(field: string) {
    const input = this.portfolio.get(field);
    return input.dirty && input.invalid;
  }

  fieldClass(field: string) {
    return { 'is-invalid': this.isValid(field) };
  }

  preUpload(event) {
    this.Image = event.target.files[0];
    if (event.target.files.length > 0) {
      this.isFileChosen = true;
    }
    this.fileName = this.Image.name;
  }
  preUpload2(event) {
    this.Resume = event.target.files[0];
    if (event.target.files.length > 0) {
      this.isFileChosen2 = true;
    }
    this.fileName2 = this.Resume.name;
  }
}
