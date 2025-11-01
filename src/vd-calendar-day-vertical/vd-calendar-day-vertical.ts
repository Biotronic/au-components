import './vd-calendar-day-vertical.scss'
import { autoinject, bindable } from 'aurelia-framework';

@autoinject
export class VdCalendarDayVertical {
  @bindable
  public items: any[];
}
