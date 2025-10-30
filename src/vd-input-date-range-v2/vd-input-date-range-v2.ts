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
  private linked1: '' | 'linked-before' | 'linked-after' = '';
  private linked2: '' | 'linked-before' | 'linked-after' = '';

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

  private views: number[][] = [[0,0], [0,0]];
  private viewChanged(calIdx: number, year: number, month: number) {
    this.views[calIdx] = [year, month];
    if (this.views[0][0] == this.views[1][0] && this.views[0][1] == this.views[1][1]) {
      this.linked1 = '';
      this.linked2 = '';
    }
    if (this.views[0][0] < this.views[1][0] || (this.views[0][0] == this.views[1][0] && this.views[0][1] == this.views[1][1])) {
      this.linked1 = 'linked-before';
      this.linked2 = 'linked-after';
    }
    if (this.views[1][0] < this.views[0][0] || (this.views[1][0] == this.views[0][0] && this.views[1][1] == this.views[0][1])) {
      this.linked1 = 'linked-after';
      this.linked2 = 'linked-before';
    }
  }
}
