import { bindable, containerless } from 'aurelia-framework';
import './vd-table-header-sortable.scss';
import { VdTable } from './vd-table';

@containerless()
export class VdTableHeaderSortable {
  @bindable
  public field: string;

  public element: HTMLElement;

  public table: VdTable;

  attached() {
    this.element.addEventListener('click', this.sort.bind(this));
  }

  bind(table) {
    this.table = table;
  }

  public sort() {
    if (this.table) {
      this.table.setSort(this.field);
    }
  }
}
