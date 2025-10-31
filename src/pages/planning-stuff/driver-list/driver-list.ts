import { autoinject, bindable } from 'aurelia-framework';
import "./driver-list.scss";
import { PlanningStuff } from '../planning-stuff';
import { PlanningListBase } from '../planning-list-base';
import { IDriver } from '../model';
import { TimeSpan } from 'utility/timespan';

@autoinject
export class DriverList extends PlanningListBase<IDriver> {
  @bindable
  public planning: PlanningStuff;
  @bindable
  public openable = true;

  public get times(): string[] {
    const step = TimeSpan.fromMinutes(60);
    return new Array(24).fill(0).map((_, i) => TimeSpan.fromMilliseconds(step.totalMilliseconds * i).toString('hh:mm'));
  };

  constructor() {
    super();
    this.dragType = 'driver';
    this.acceptDrag = ['task'];
  }

  private newTab() {
    this.planning.openInNewTab('drivers');
  }
}
