import { TimeSpan } from "utility/timespan";
import "./tasks.scss";
import { autoinject } from 'aurelia-framework';

@autoinject
export class Tasks {
  public tasks = [{
    title: 'Task 1 - 1h',
    duration: TimeSpan.fromHours(1)
  },{
    title: 'Task 2 - 2h',
    duration: TimeSpan.fromHours(2)
  },{
    title: 'Task 3 - 3h',
    duration: TimeSpan.fromHours(3)
  },{
    title: 'Task 4 - 4h',
    duration: TimeSpan.fromHours(4)
  }];
}
