import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PortfolioDataService } from '../../portfolio-data.service';
import { Education } from '../../data-types/education';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.css']
})
export class EducationComponent implements OnInit {

  @Input() id: number;
  education$: Observable<Education>;
  public showMsg: boolean;
  public education: FormGroup;
  constructor(private fb: FormBuilder, private _portfolioDataService: PortfolioDataService) { }

  ngOnInit() {
    const reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
    this.education = this.fb.group({
      institute: ['', [Validators.required]],
      description: ['', [Validators.required]],
      link: ['', [Validators.required, Validators.pattern(reg)]],
      course: ['', [Validators.required]],
      startYear: ['', [Validators.required]],
      endYear: ['', [Validators.required]]
    });

    this.education$ = this._portfolioDataService.getEducation(this.id);
  }

  onSubmit() {

    this._portfolioDataService.postEducation(this.id,
      {
        institute: this.education.value.institute,
        description: this.education.value.description,
        link: this.education.value.link,
        course: this.education.value.course,
        startYear: this.education.value.startYear,
        endYear: this.education.value.endYear
      } as Education).subscribe(val => {
        this.showMsg = true;
        this.education.reset();
        this.education$ = this._portfolioDataService.getEducation(this.id);
      });


  }


  getYear(date: Date) {
    const d = new Date(date);
    const today = new Date();
    if (d > today) {
    return 'ongoing';
  } else {
    return d.getFullYear();
  }
  }

  delete(id: number) {
    if (confirm('Are you sure you want to delete this education?')) {
    this._portfolioDataService.deleteEducation(this.id, id).subscribe(val => {
      this._portfolioDataService.getEducation(this.id);
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
    const input = this.education.get(field);
    return input.dirty && input.invalid;
  }

  fieldClass(field: string) {
    return { 'is-invalid': this.isValid(field) };
  }

}
