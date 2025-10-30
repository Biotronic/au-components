import { Router } from 'aurelia-router';
import { autoinject } from 'aurelia-framework';

@autoinject
export class PlanningStuff {
  private items = [{}, {}, {}];

  public message: string = 'I, for one, welcome our Aurelia overlords';

  private window: Window;

  constructor(private router: Router) {
  }

  public async newTab() {
    let url = this.router.generate('tasks');
    if (this.window) {
      this.window.close();
    }
    (window as any).planningStuff = this;
    this.window = window.open(url, '_blank', 'popup');
  }

  startDrag(element) {
    console.log(element);
  }
}
