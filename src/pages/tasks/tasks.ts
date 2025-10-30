import "./tasks.scss";
import { PlanningStuff } from './../planning-stuff/planning-stuff';
import { autoinject, observable } from 'aurelia-framework';

@autoinject
export class Tasks {
  private plan: PlanningStuff;
  private element: HTMLElement;

  private items = [{}, {}, {}];


  constructor() {
    this.plan = window.opener.planningStuff;
    delete window.opener.planningStuff;
  }

  attached() {
    this.element.addEventListener('dragstart', (e: DragEvent) => {



      this.plan.startDrag(this.items[+(e.target as HTMLElement).dataset.index]);

    }, { capture: true });
  }
}
