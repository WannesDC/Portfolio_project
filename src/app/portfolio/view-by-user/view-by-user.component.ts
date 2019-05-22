import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { RouteConfigLoadEnd, RouteConfigLoadStart, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Contact } from '../data-types/contact';
import { Portfolio } from '../data-types/portfolio';
import { PortfolioDataService } from '../portfolio-data.service';
import { publishReplay, refCount } from 'rxjs/operators';



@Component({
  selector: 'app-view-by-user',
  templateUrl: './view-by-user.component.html',
  styleUrls: ['./view-by-user.component.css']
})

export class ViewByUserComponent implements OnInit {

  public contact: FormGroup;

  public imageToShow: any;
  public isImageLoading = true;

  public pdfToShow: any;
  public isPDFLoading = true;

  loadingRouteConfig: boolean;
  @Input() id: number;
  @Input() portfolio$: Observable<Portfolio>;

  public contact$: Observable<Contact>;
  public contactSub: Contact;


  constructor(private router: Router,
              private fb: FormBuilder,
              private _portfolioDataService: PortfolioDataService,
              private sanitizer: DomSanitizer
    ) {

    }

  ngOnInit() {

    this.router.events.subscribe(event => {
      if (event instanceof RouteConfigLoadStart) {
          this.loadingRouteConfig = true;
      } else if (event instanceof RouteConfigLoadEnd) {
          this.loadingRouteConfig = false;
      }
    });

    this.contact$ = this._portfolioDataService.getContact(this.id).pipe(
      publishReplay(1),
      refCount()
      );
    // maakt een buffer aan van mogelijke waarden (hier met lengte 1),
    // iedereen die daar op subscribed gebruikt de laatste waarde dat erin zit en voor te volledige pipe niet opnieuw uit


    this._portfolioDataService.getImage(this.id).subscribe(
      data => {
        this.createImageFromBlob(data);
        this.isImageLoading = false;
      }, error => {
        this.isImageLoading = true;
        console.log(error);
      }

    );

    this._portfolioDataService.getResume(this.id).subscribe(
      data => {
        const file = new Blob([data], { type: 'application/pdf' });
        const something = URL.createObjectURL(file);
        this.pdfToShow = this.sanitizer.bypassSecurityTrustResourceUrl(something);
        this.isPDFLoading = false;
      }, error => {
        this.isPDFLoading = true;
        console.log(error);
      }

    );




    this.contact = this.fb.group({
      name: ['', [Validators.required]],
      surname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      birthDate: ['', [Validators.required]],
      street: ['', [Validators.required]],
      city: ['', [Validators.required]],
      country: ['', [Validators.required]],
      postalCode: ['', [Validators.required, Validators.minLength(4)]]
    });




  }

  scroll(el: HTMLElement) {
    el.scrollIntoView();
    
  }

  onSubmit(id: number) {

    this.contact$ = this._portfolioDataService.postContact(id,
    {
      name: this.contact.value.name,
      surname: this.contact.value.surname,
      email: this.contact.value.email,
      birthDate: this.contact.value.birthDate,
      street: this.contact.value.street,
      city: this.contact.value.city,
      country: this.contact.value.country,
      postalcode: this.contact.value.postalCode
    } as Contact).pipe(
      publishReplay(1),
      refCount()
    );


  }

  formatDate(date: Date) {
    const d = new Date(date);
    return d.getDate() + '-' + d.getMonth() + '-' + d.getFullYear();
  }


  delete(id: number) {
    if (confirm('Are you sure you want to delete your portfolio?')) {
      this._portfolioDataService.deletePortfolio(id);
      this.portfolio$ = null;
      this.router.navigate(['/portfolio/add-portfolio']);
      // this.router.navigateByUrl('/RefreshComponent', {skipLocationChange: true})/*.then(() => this.router.navigate(['/portfolio/']))*/;
    }

  }
  deleteC(id: number, cid: number) {
    if (confirm('Are you sure you want to delete your contact details?')) {
      this._portfolioDataService.deleteContact(id, cid);
      this.contact$ = null;
    }

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
    } else if (errors.email) {
      return `Not valid`;
    }
  }

  isValid(field: string) {
    const input = this.contact.get(field);
    return input.dirty && input.invalid;
  }

  fieldClass(field: string) {
    return { 'is-invalid': this.isValid(field) };
  }

  get image(): string {
    if (this.portfolio$ != null) {
      if (this.imageToShow == null ) {
        return '../../../assets/images/default-profile-pic.png';
      } else {
        return this.imageToShow;
      }
    } else {
      return null;
    }
  }

  private createImageFromBlob(image: Blob) {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
       this.imageToShow = reader.result;
    }, false);

    if (image) {
       reader.readAsDataURL(image);
    }
 }

 get pdf(): string {
    if (this.pdfToShow == null ) {
      return '../../../assets/files/default-pdf.pdf';
    } else {
      return this.pdfToShow;
    }
}
}
