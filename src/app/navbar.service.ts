import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {

  public visible = new BehaviorSubject<boolean>(true);

  constructor() { this.visible.next(true);}

  hide(){this.visible.next(false);}

  show(){this.visible.next(true)}

  toggle(){this.visible.next(!this.visible.getValue());}
}
