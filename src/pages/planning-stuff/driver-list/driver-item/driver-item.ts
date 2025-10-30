import { PlanningStuff } from "pages/planning-stuff/planning-stuff";
import "./driver-item.scss";
import { autoinject, bindable } from 'aurelia-framework';
import { IDriver } from "pages/planning-stuff/model";

@autoinject
export class DriverItem {
  @bindable
  public driver: IDriver;
  @bindable
  public planning: PlanningStuff;
}
