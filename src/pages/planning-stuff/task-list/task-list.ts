import { autoinject, bindable } from 'aurelia-framework';
import "./task-list.scss";
import { PlanningStuff } from '../planning-stuff';
import { PlanningListBase } from '../planning-list-base';
import { ITask } from '../model';

@autoinject
export class TaskList extends PlanningListBase<ITask> {
  @bindable
  public planning: PlanningStuff;
  @bindable
  public openable = true;

  constructor() {
    super();
    this.dragType = 'task';
    this.acceptDrag = ['driver', 'vehicle'];
  }

  private newTab() {
    this.planning.openInNewTab('tasks');
  }
}
