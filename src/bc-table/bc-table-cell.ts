import { bindable, containerless } from 'aurelia-framework';
import './bc-table-cell.scss';

@containerless()
export class BcTableCell {
  @bindable
  public field: string;
}
