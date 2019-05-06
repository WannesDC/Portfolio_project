import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-skill',
  templateUrl: './skill.component.html',
  styleUrls: ['./skill.component.css']
})
export class SkillComponent implements OnInit {

  public skill: FormGroup;
  constructor(private fb:FormBuilder) { }

  ngOnInit() {
    this.skill = this.fb.group({
      type: ['', [Validators.required, Validators.minLength(2)]],
      description:['', [Validators.required, Validators.minLength(2)]],
      iconPath:['', [Validators.required, Validators.minLength(2)]]
      
    });
  }

  onSubmit(){}
}
