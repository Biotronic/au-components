import { SortState } from '../valueConverters/SortState';
import { bindable } from 'aurelia-framework';
import './vd-table.scss'

export class VdTable {
  @bindable
  public data: any[];

  @bindable
  public sort: SortState = new SortState();

  public setSort(field: string) {
    this.sort.sortBy(field);
  }
}
