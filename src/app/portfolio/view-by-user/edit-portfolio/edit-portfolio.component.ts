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

    this.portfolio$ = this.port;
    this.saveP = this.fb.group({
      pName: ['', [Validators.required, Validators.minLength(2)]],
      description:['', [Validators.required, Validators.minLength(10)]],
      picturePath:['', [Validators.required, Validators.minLength(10)]],
      resumePath:['', [Validators.required, Validators.minLength(10)]]
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
}
