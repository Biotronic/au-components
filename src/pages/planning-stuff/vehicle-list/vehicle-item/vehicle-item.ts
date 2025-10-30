import { PlanningStuff } from "pages/planning-stuff/planning-stuff";
import "./vehicle-item.scss";
import { autoinject, bindable, observable } from 'aurelia-framework';
import { IVehicle } from "pages/planning-stuff/model";

@autoinject
export class VehicleItem {
  @bindable
  public vehicle: IVehicle;
  @bindable
  public planning: PlanningStuff;
}
