import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { PortfolioDataService } from '../../portfolio-data.service';
import { Work } from '../../data-types/work';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-work',
  templateUrl: './work.component.html',
  styleUrls: ['./work.component.css']
})
export class WorkComponent implements OnInit {

  @Input() id:number;
  work$: Observable<Work>
  public showMsg: boolean;
  public work: FormGroup;
  constructor(private fb: FormBuilder,private _portfolioDataService : PortfolioDataService) { }

  ngOnInit() {
    const reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
    this.work = this.fb.group({
      name: ['', [Validators.required]],
      description:['', [Validators.required]],
      imagePath:['', [Validators.required, Validators.pattern(reg)]],
      link:['', [Validators.required,Validators.pattern(reg) ]],
      timePublished:['', [Validators.required ]]
    });
    this.work$ = this._portfolioDataService.getWork(this.id);
  }

  formatDate(date:Date){
    let d = new Date(date);
    return d.getDate()+"-"+d.getMonth()+"-"+d.getFullYear();
  }
  
  onSubmit(){
    this._portfolioDataService.postWork(this.id,
      {
        workName: this.work.value.name,
        description: this.work.value.description,
        imagePath: this.work.value.imagePath,
        link: this.work.value.link,
        timePublished: this.work.value.timePublished
      } as Work
    ).subscribe(val => this.showMsg=true);
    this.work$ = this._portfolioDataService.getWork(this.id);
  }

  delete(id:number){
    if(confirm("Are you sure you want to delete this work?")) {
    this._portfolioDataService.deleteWork(this.id, id);
    this.work$ = this._portfolioDataService.getWork(this.id);
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
    }
  }

  isValid(field: string) {
    const input = this.work.get(field);
    return input.dirty && input.invalid;
  }

  fieldClass(field: string) {
    return { "is-invalid": this.isValid(field) };
  }
}
