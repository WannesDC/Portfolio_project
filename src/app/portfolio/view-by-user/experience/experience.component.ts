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
  public experience : FormGroup;
  constructor(private fb: FormBuilder, private _portfolioDataService : PortfolioDataService) { }

  ngOnInit() {
    this.experience = this.fb.group({
      company: ['', [Validators.required, Validators.minLength(2)]],
      jobPos: ['', [Validators.required, Validators.minLength(2)]],
      link:['', [Validators.required, Validators.minLength(2)]],
      description:['', [Validators.required, Validators.minLength(2)]],
      startYear:['', [Validators.required, Validators.minLength(2)]],
      endYear:['', [Validators.required, Validators.minLength(2)]]
    });

    this.experience$ = this._portfolioDataService.getExperience(this.id);

  }

  onSubmit(){
    this.experience$ = this._portfolioDataService.postExperience(this.id,
      {
        company: this.experience.value.company,
        jobPos: this.experience.value.jobPos,
        link: this.experience.value.link,
        description: this.experience.value.description,
        startYear: this.experience.value.startYear,
        endYear: this.experience.value.endYear
      }as Experience).pipe()
  }

  getYear(date:Date){
    let d = new Date(date);
    return d.getFullYear();
  }

  delete(id:number){
    this._portfolioDataService.deleteExperience(this.id, id);
    this.experience$ = this._portfolioDataService.getExperience(this.id);
  }
}
