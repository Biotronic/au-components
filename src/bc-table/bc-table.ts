import { SortState } from './../valueConverters/SortState';
import { bindable } from 'aurelia-framework';
import './bc-table.scss'

export class BcTable {
  @bindable
  public data: any[];

  @bindable
  public sort: SortState = new SortState();

  public setSort(field: string) {
    this.sort.sortBy(field);
  }
}
