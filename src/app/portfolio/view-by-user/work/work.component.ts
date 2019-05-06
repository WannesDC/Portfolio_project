import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-work',
  templateUrl: './work.component.html',
  styleUrls: ['./work.component.css']
})
export class WorkComponent implements OnInit {

  public work: FormGroup;
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.work = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description:['', [Validators.required, Validators.minLength(2)]],
      picturePath:['', [Validators.required, Validators.minLength(2)]],
      link:['', [Validators.required, Validators.minLength(2)]],
      timePublished:['', [Validators.required, Validators.minLength(2)]]
    });
  }

  onSubmit(){}
}
