import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PortfolioDataService } from '../../portfolio-data.service';
import { Education } from '../../data-types/education';

@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.css']
})
export class EducationComponent implements OnInit {

  @Input() id:number;
  @Input() edu:Education;
  
  public education: FormGroup;
  constructor(private fb: FormBuilder, private _portfolioDataService : PortfolioDataService) { }

  ngOnInit() {
    this.education = this.fb.group({
      institute: ['', [Validators.required, Validators.minLength(2)]],
      description:['', [Validators.required, Validators.minLength(2)]],
      link:['', [Validators.required, Validators.minLength(2)]],
      course:['', [Validators.required, Validators.minLength(2)]],
      startYear:['', [Validators.required, Validators.minLength(2)]],
      endYear:['', [Validators.required, Validators.minLength(2)]]
    });
  }

  onSubmit(){
    
    this._portfolioDataService.postEducation(this.id,
      {
        institute: this.education.value.institute,
        description: this.education.value.description,
        link: this.education.value.link,
        course: this.education.value.course,
        startYear: this.education.value.startYear,
        endYear: this.education.value.endYear
      } as Education).subscribe();
  }

}
