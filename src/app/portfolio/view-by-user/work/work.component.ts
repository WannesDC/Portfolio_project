import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { PortfolioDataService } from '../../portfolio-data.service';
import { Work } from '../../data-types/work';

@Component({
  selector: 'app-work',
  templateUrl: './work.component.html',
  styleUrls: ['./work.component.css']
})
export class WorkComponent implements OnInit {

  @Input() id:number;
  public work: FormGroup;
  constructor(private fb: FormBuilder,private _portfolioDataService : PortfolioDataService) { }

  ngOnInit() {
    this.work = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description:['', [Validators.required, Validators.minLength(2)]],
      picturePath:['', [Validators.required, Validators.minLength(2)]],
      link:['', [Validators.required, Validators.minLength(2)]],
      timePublished:['', [Validators.required, Validators.minLength(2)]]
    });
  }

  onSubmit(){
    this._portfolioDataService.postWork(this.id,
      {
        workName: this.work.value.name,
        description: this.work.value.description,
        picturePath: this.work.value.picturePath,
        link: this.work.value.link,
        timePublished: this.work.value.timePublished
      } as Work
    ).subscribe();
  }
}
