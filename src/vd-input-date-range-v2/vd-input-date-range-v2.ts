import { bindable, bindingMode, observable } from 'aurelia-framework';
import './vd-input-date-range-v2.scss'
import { VdInputCalendarV2 } from 'vd-input-calendar-v2/vd-input-calendar-v2';

export class VdInputDateRangeV2 {
  @observable
  public selectedDates: Date[] = [];

  @bindable
  public fromDate: Date;
  @bindable
  public toDate: Date;

  @bindable
  public min?: Date;
  @bindable
  public max?: Date;

  private element: HTMLElement;

  private popupMode: 'hidden' | 'visible' = 'hidden';

  private updating: boolean = false;
  private calendar1: { au: { controller: { viewModel: VdInputCalendarV2 } } };
  private calendar2: { au: { controller: { viewModel: VdInputCalendarV2 } } };

  private selectedDatesChanged() {
    if (this.updating) {
      return;
    }
    this.updating = true;
    if (this.selectedDates.length >= 2) {
      if (this.selectedDates[0] > this.selectedDates[1]) {
        this.fromDate = this.selectedDates[1];
        this.toDate = this.selectedDates[0];
      } else {
        this.fromDate = this.selectedDates[0];
        this.toDate = this.selectedDates[1];
      }
    }
    this.updating = false;
  }

  private fromDateChanged(newValue, oldValue) {
    if (this.updating) {
      return;
    }
    this.updating = true;
    if (oldValue == this.selectedDates[1]) {
      this.selectedDates = [this.selectedDates[0], newValue];
    } else {
      this.selectedDates = [this.selectedDates[1], newValue];
    }
    this.updating = false;
  }

  private toDateChanged(newValue, oldValue) {
    if (this.updating) {
      return;
    }
    this.updating = true;
    if (oldValue == this.selectedDates[1]) {
      this.selectedDates = [this.selectedDates[0], newValue];
    } else {
      this.selectedDates = [this.selectedDates[1], newValue];
    }
    this.updating = false;
  }

  private togglePopup() {
    if (this.popupMode == 'visible') {
      this.popupMode = 'hidden';
    } else {
      this.popupMode = 'visible';
    }
  }

  private selectionChanged() {
    this.selectedDatesChanged();
  }

  private handleFocusOut() {
    setTimeout(() => {
      if (!this.element.matches(':focus-within')) {
        this.popupMode = 'hidden';
      }
    }, 0);
  }
}
