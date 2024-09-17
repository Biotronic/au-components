import { bindable, containerless } from 'aurelia-framework';
import './bc-table-header-sortable.scss';
import { BcTable } from './bc-table';

@containerless()
export class BcTableHeaderSortable {
  @bindable
  public field: string;

  public element: HTMLElement;

  public table: BcTable;

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
