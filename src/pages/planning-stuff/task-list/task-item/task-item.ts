import { PlanningStuff } from "pages/planning-stuff/planning-stuff";
import "./task-item.scss";
import { autoinject, bindable } from 'aurelia-framework';
import { ITask } from "pages/planning-stuff/model";

@autoinject
export class TaskItem {
  @bindable
  public task: ITask;
  @bindable
  public planning: PlanningStuff;
}
