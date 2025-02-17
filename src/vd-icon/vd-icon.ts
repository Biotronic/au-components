import { bindable } from 'aurelia-framework';
import "./vd-icon.scss"

export class VdIcon {
  @bindable
  public icon: string;

  @bindable
  public iconType: string = 'svg';
}
