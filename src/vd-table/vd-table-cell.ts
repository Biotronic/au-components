import { bindable, containerless } from 'aurelia-framework';
import './vd-table-cell.scss';

@containerless()
export class VdTableCell {
  @bindable
  public field: string;
}
