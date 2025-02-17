import { bindable } from 'aurelia-framework';
import "./vd-checkbox.scss"

export class VdCheckbox {
  @bindable
  public checked: boolean;

  @bindable
  public text: string;

  @bindable
  public tabindex: number;
}
