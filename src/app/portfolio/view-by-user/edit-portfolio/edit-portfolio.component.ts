import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PortfolioDataService } from '../../portfolio-data.service';
import { Observable } from 'rxjs';
import { Portfolio } from '../../data-types/portfolio';

@Component({
  selector: 'app-edit-portfolio',
  templateUrl: './edit-portfolio.component.html',
  styleUrls: ['./edit-portfolio.component.css']
})
export class EditPortfolioComponent implements OnInit {

  public portfolio$: Observable<Portfolio>;
  public saveP:FormGroup;
  public showMsg: boolean;

  @Input() id:number;
  @Input() port: Observable<Portfolio>;

  constructor(private fb: FormBuilder, private _portfolioDataService : PortfolioDataService) { }

  ngOnInit() {
    const reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
    this.portfolio$ = this.port;
    this.saveP = this.fb.group({
      pName: ['', []],
      description:['', []],
      picturePath:['', [Validators.pattern(reg)]],
      resumePath:['', [Validators.pattern(reg)]]
    });
  }



  onSubmit(){
    this._portfolioDataService.putPortfolio(this.id,
      {
        name: this.saveP.value.pName,
        description: this.saveP.value.description,
        picturePath: this.saveP.value.picturePath,
        resumePath: this.saveP.value.resumePath
      } as Portfolio).subscribe(val => this.showMsg= true);

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
    const input = this.saveP.get(field);
    return input.dirty && input.invalid;
  }

  fieldClass(field: string) {
    return { "is-invalid": this.isValid(field) };
  }
}
