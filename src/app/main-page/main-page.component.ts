import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { delay } from 'q';


@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {


  constructor() { }

  ngOnInit() {
    
  }

  scroll(el: HTMLElement) {
    //bootstrap collapse scrollintoview angular
    el.scrollIntoView();
  }

}
