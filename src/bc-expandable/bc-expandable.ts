import { bindable } from 'aurelia-framework';
import './bc-expandable.scss'

export class BcExpandable {
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
