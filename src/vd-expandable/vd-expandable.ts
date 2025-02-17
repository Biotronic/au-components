import { bindable } from 'aurelia-framework';
import './vd-expandable.scss'

export class VdExpandable {
  @bindable
  public header: string;

  @bindable
  public expanded: boolean;

  public get icon(): string {
    return this.expanded ? 'expand_less' : 'expand_more';
  }
  
  public get contentsClass(): string {
    return this.expanded ? 'expanded' : 'collapsed';
  }

  public toggle() {
    this.expanded = !this.expanded;
  }
}
