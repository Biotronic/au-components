import { bindable } from 'aurelia-framework';
import "./bc-icon.scss"

export class BcIcon {
  @bindable
  public icon: string;

  @bindable
  public iconType: string = 'svg';
}
