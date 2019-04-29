import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewByUserComponent } from './view-by-user.component';

describe('ViewByUserComponent', () => {
  let component: ViewByUserComponent;
  let fixture: ComponentFixture<ViewByUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewByUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewByUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
