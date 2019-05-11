import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PortfolioDataService } from '../../portfolio-data.service';
import { Skill } from '../../data-types/skill';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-skill',
  templateUrl: './skill.component.html',
  styleUrls: ['./skill.component.css']
})
export class SkillComponent implements OnInit {

  @Input() id:number;
  skill$:Observable<Skill>
  public skill: FormGroup;
  public showMsg: boolean;
  constructor(private fb:FormBuilder,private _portfolioDataService : PortfolioDataService) { }

  ngOnInit() {
    this.skill = this.fb.group({
      type: ['', [Validators.required, Validators.minLength(2)]],
      description:['', [Validators.required, Validators.minLength(2)]],
      iconPath:['', [Validators.required, Validators.minLength(2)]]
      
    });

      this.skill$ = this._portfolioDataService.getSkill(this.id);

  }

  onSubmit(){
    this._portfolioDataService.postSkill(this.id,{
      type: this.skill.value.type,
      description: this.skill.value.description,
      iconPath: this.skill.value.iconPath
    } as Skill).subscribe(val => this.showMsg=true);
    this.skill$ = this._portfolioDataService.getSkill(this.id);

  }

  delete(id:number){
    if(confirm("Are you sure you want to delete this skill?")) {
    this._portfolioDataService.deleteSkill(this.id, id);
    this.skill$ = this._portfolioDataService.getSkill(this.id);
    }
  }
}
