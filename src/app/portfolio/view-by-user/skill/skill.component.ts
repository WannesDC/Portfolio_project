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
    const reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
    this.skill = this.fb.group({
      type: ['', [Validators.required]],
      description:['', [Validators.required]],
      iconPath:['', [Validators.pattern(reg)]]
      
    });

      this.skill$ = this._portfolioDataService.getSkill(this.id);

  }

  onSubmit(){
    this._portfolioDataService.postSkill(this.id,{
      type: this.skill.value.type,
      description: this.skill.value.description,
      iconPath: this.skill.value.iconPath || 'https://i.gyazo.com/862c7ad89834f48d3f5505b68e6a4297.png'
    } as Skill).subscribe(val => {
      this.showMsg=true;
      this.skill.reset();
    });
    this.skill$ = this._portfolioDataService.getSkill(this.id);

  }

  delete(id:number){
    if(confirm("Are you sure you want to delete this skill?")) {
    this._portfolioDataService.deleteSkill(this.id, id);
    this.skill$ = this._portfolioDataService.getSkill(this.id);
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
      return `You must provide an image URL, right click on an image and copy source!`;
    }
  }

  isValid(field: string) {
    const input = this.skill.get(field);
    return input.dirty && input.invalid;
  }

  fieldClass(field: string) {
    return { "is-invalid": this.isValid(field) };
  }
}
