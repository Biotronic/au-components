import { autoinject, bindable } from 'aurelia-framework';
import "./vehicle-list.scss";
import { PlanningStuff } from '../planning-stuff';
import { PlanningListBase } from '../planning-list-base';
import { IVehicle } from '../model';

@autoinject
export class VehicleList extends PlanningListBase<IVehicle> {
  @bindable
  public planning: PlanningStuff;
  @bindable
  public openable = true;

  constructor() {
    super();
    this.dragType = 'vehicle';
    this.acceptDrag = ['task'];
  }

  private newTab() {
    this.planning.openInNewTab('vehicles');
  }
}
