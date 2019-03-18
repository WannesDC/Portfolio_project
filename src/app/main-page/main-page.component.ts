import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';


@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {
  public user: FormGroup;

  constructor() { }

  ngOnInit() {
   // this.user = new FormGroup({
     // name: new FormControl('Wans')
    //})
  }

}
