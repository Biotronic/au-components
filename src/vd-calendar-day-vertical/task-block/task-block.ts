import { autoinject, bindable } from 'aurelia-framework';
import './task-block.scss'
import { ITask } from '../vd-calendar-day-vertical';
import moment from 'moment';

@autoinject
export class TaskBlock {
  @bindable
  public task: ITask;

  public get top() {
    let day = moment(this.task.from).startOf('day');
    let now = moment(this.task.from);
    return now.diff(day) / 60000;
  }

  public get height() {
    let then = moment(this.task.from);
    let now = moment(this.task.to);
    return now.diff(then) / 60000;
  }
}
