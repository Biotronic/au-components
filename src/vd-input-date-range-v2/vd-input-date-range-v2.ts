import { bindable, bindingMode, observable } from 'aurelia-framework';
import './vd-input-date-range-v2.scss'

export class VdInputDateRangeV2 {
  @observable
  public selectedDates: Date[] = [,];

  @bindable
  public fromDate: Date;
  @bindable
  public toDate: Date;

  private selectedDatesChanged() {
    if (this.selectedDates.length >= 2) {
      this.fromDate = this.selectedDates[0];
      this.toDate = this.selectedDates[1];
    }
  }

  private fromDateChanged() {
    this.selectedDates[0] = this.fromDate;
  }

  private toDateChanged() {
    this.selectedDates[1] = this.toDate;
  }
}
