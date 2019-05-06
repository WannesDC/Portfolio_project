import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.css']
})
export class ExperienceComponent implements OnInit {

  public experience : FormGroup;
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.experience = this.fb.group({
      company: ['', [Validators.required, Validators.minLength(2)]],
      link:['', [Validators.required, Validators.minLength(2)]],
      description:['', [Validators.required, Validators.minLength(2)]],
      startYear:['', [Validators.required, Validators.minLength(2)]],
      endYear:['', [Validators.required, Validators.minLength(2)]]
    });
  }

  onSubmit(){}
}
