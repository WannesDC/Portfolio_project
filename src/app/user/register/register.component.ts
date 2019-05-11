import { Component, OnInit } from '@angular/core';
import { AbstractControl,FormGroup, FormBuilder,ValidatorFn, Validators } from '@angular/forms';
import { AuthenticationService } from '../authentication.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

function comparePasswords(control: AbstractControl): { [key: string]: any } {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  return password.value === confirmPassword.value
    ? null
    : { passwordsDiffer: true };
}

function serverSideValidateUsername(
  checkAvailabilityFn: (n: string) => Observable<boolean>
): ValidatorFn {
  return (control: AbstractControl): Observable<{ [key: string]: any }> => {
    return checkAvailabilityFn(control.value).pipe(
      map(available => {
        if (available) {
          return null;
        }
        return { userAlreadyExists: true };
      })
    );
  };
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public user: FormGroup;
  public errorMsg: string;

    constructor(private authService: AuthenticationService,
      private router: Router,
      private fb: FormBuilder) {
      
     }

  ngOnInit() {
    let signRegex = /[!@#$%^&*(),.?":{}|<>_-]/;
    this.user = this.fb.group({
      firstname:['', Validators.required],
      lastname:['', Validators.required],
      email:[
        '',
        [Validators.required, Validators.email],
        serverSideValidateUsername(this.authService.checkUserNameAvailability)
      ],
      passwordGroup: this.fb.group(
        {
          password: ['', 
            [Validators.required,
              Validators.pattern(/\d/),
              Validators.pattern(/[A-Z]/),
              Validators.pattern(/[a-z]/),
              Validators.pattern(signRegex),
              Validators.minLength(8)              
           ]],
          confirmPassword:['',Validators.required]
        },
        {validator: comparePasswords}
      )
    })
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
    } else if (errors.userAlreadyExists) {
      return `User already exists`;
    } else if (errors.email) {
      return `Not a valid email address`;
    } else if (errors.passwordsDiffer) {
      return `Passwords are not the same`;
    } else if (errors.pattern){
      return `Passwords need at least 8 characters, one number, one capital, one lower case and one special symbol`
    }
  }
  onSubmit() {
    //ADD EXHAUST HERE IN CASE THEY SPAM LOGIN!!
    this.authService
      .register(
        this.user.value.firstname,
        this.user.value.lastname,
        this.user.value.email,
        this.user.value.passwordGroup.password
      )
      .subscribe(
        val => {
          if (val) {
            if (this.authService.redirectUrl) {
              this.router.navigateByUrl(this.authService.redirectUrl);
              this.authService.redirectUrl = undefined;
            } else {
              this.router.navigate(['']);
            }
          } else {
            this.errorMsg = `Could not login`;
          }
        },
        (err: HttpErrorResponse) => {
          console.log(err);
          if (err.error instanceof Error) {
            this.errorMsg = `Error while trying to login user ${
              this.user.value.email
            }: ${err.error.message}`;
          } else {
            this.errorMsg = `Error ${err.status} while trying to login user ${
              this.user.value.email
            }: ${err.error}`;
          }
        }
      );
  }


  isValid(field: string) {
    const input = this.user.get(field);
    return input.dirty && input.invalid;
  }

  fieldClass(field: string) {
    return { "is-invalid": this.isValid(field) };
  }
}
