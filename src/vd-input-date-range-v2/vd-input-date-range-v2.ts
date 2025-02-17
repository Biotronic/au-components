import { bindable, bindingMode, observable } from 'aurelia-framework';
import './vd-input-date-range-v2.scss'

export class VdInputDateRangeV2 {
  @observable
  public selectedDates: Date[] = [];

  @bindable
  public fromDate: Date;
  @bindable
  public toDate: Date;

  private popupMode: 'hidden' | 'visible' = 'hidden';

  private selectedDatesChanged() {
    console.log('selectedDatesChanged', this.selectedDates);
    if (this.selectedDates.length >= 2) {
      this.fromDate = this.selectedDates[0];
      this.toDate = this.selectedDates[1];
    }
  }

  private fromDateChanged(newValue, oldValue) {
    if (oldValue == this.selectedDates[1]) {
      this.selectedDates = [this.selectedDates[0], newValue];
    } else {
      this.selectedDates = [this.selectedDates[1], newValue];
    }
  }

  private toDateChanged(newValue, oldValue) {
    if (oldValue == this.selectedDates[1]) {
      this.selectedDates = [this.selectedDates[0], newValue];
    } else {
      this.selectedDates = [this.selectedDates[1], newValue];
    }
  }

  private togglePopup() {
    if (this.popupMode == 'visible') {
      this.popupMode = 'hidden';
    } else {
      this.popupMode = 'visible';
    }
  }
}
