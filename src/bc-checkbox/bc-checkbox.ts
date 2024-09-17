import { bindable } from 'aurelia-framework';
import "./bc-checkbox.scss"

export class BcCheckbox {
  @bindable
  public checked: boolean;

  @bindable
  public text: string;

  @bindable
  public tabindex: number;
}
