import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PortfolioDataService } from '../../portfolio-data.service';
import { Experience } from '../../data-types/experience';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.css']
})
export class ExperienceComponent implements OnInit {

  @Input() id:number;
  experience$: Observable<Experience>;
  public showMsg: boolean;

  public experience : FormGroup;
  constructor(private fb: FormBuilder, private _portfolioDataService : PortfolioDataService) { }

  ngOnInit() {
    const reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
    this.experience = this.fb.group({
      company: ['', [Validators.required]],
      jobPos: ['', [Validators.required]],
      link:['', [Validators.required, Validators.pattern(reg)]],
      description:['', [Validators.required]],
      startYear:['', [Validators.required]],
      endYear:['', [Validators.required]]
    });

    this.experience$ = this._portfolioDataService.getExperience(this.id);

  }

  onSubmit(){
    this._portfolioDataService.postExperience(this.id,
      {
        company: this.experience.value.company,
        jobPos: this.experience.value.jobPos,
        link: this.experience.value.link,
        description: this.experience.value.description,
        startYear: this.experience.value.startYear,
        endYear: this.experience.value.endYear
      }as Experience).subscribe(val => {
        this.showMsg=true;
        this.experience.reset();
        this.experience$ = this._portfolioDataService.getExperience(this.id);
      });

    
  }

  getYear(date:Date){
    const d = new Date(date);
    const today = new Date();
    if (d > today) {
    return 'ongoing';
  } else {
    return d.getFullYear();
  }
  }

  delete(id:number){
    if(confirm("Are you sure you want to delete this work experience?")) {
    this._portfolioDataService.deleteExperience(this.id, id).subscribe(val => {
      this.experience$ = this._portfolioDataService.getExperience(this.id);
    });
    
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
    const input = this.experience.get(field);
    return input.dirty && input.invalid;
  }

  fieldClass(field: string) {
    return { "is-invalid": this.isValid(field) };
  }
}
