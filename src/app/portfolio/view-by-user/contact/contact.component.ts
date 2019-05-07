import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-contact',
  styleUrls: ['./contact.component.css'],
  template: `
    Example {{ childExample }}
  `
})
export class ContactComponent implements OnInit {

  @Input() childExample: string;

  public contact: FormGroup;
  constructor() { }

  ngOnInit() {
  }

  onSubmit(){}
}
