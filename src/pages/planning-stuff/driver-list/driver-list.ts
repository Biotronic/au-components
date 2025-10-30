import { autoinject, bindable } from 'aurelia-framework';
import "./driver-list.scss";
import { PlanningStuff } from '../planning-stuff';
import { PlanningListBase } from '../planning-list-base';
import { IDriver } from '../model';

@autoinject
export class DriverList extends PlanningListBase<IDriver> {
  @bindable
  public planning: PlanningStuff;
  @bindable
  public openable = true;

  constructor() {
    super();
    this.dragType = 'driver';
    this.acceptDrag = ['task'];
  }

  private newTab() {
    this.planning.openInNewTab('drivers');
  }
}
