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

  @observable
  private popupOpen = false;

  private updating = false;
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

  private fromDateChanged(newValue: Date, oldValue: Date) {
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

  private toDateChanged(newValue: Date, oldValue: Date) {
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

  private togglePopup(state?: boolean) {
    if (state !== undefined) {
      this.popupOpen = state;
    } else {
      this.popupOpen = !this.popupOpen;
    }
  }

  private popupOpenChanged(newValue: boolean) {
    if (!newValue) {
      return;
    }
    if (this.calendar2.au.controller.viewModel.selectedDate) {
      return;
    }
    if (this.calendar2.au.controller.viewModel.month != this.calendar1.au.controller.viewModel.month) {
      return;
    }
    this.calendar1.au.controller.viewModel.changePeriod(0);
    this.calendar2.au.controller.viewModel.changePeriod(1);
  }

  private selectionChanged() {
    this.selectedDatesChanged();
  }

  private views: { year: number, month: number }[] = [{ year: 0, month: 0 }, { year: 0, month: 0 }];
  private viewChanged(calIdx: number, year: number, month: number) {
    this.views[calIdx] = { year, month };
    if (this.views[0].year == this.views[1].year && this.views[0].month == this.views[1].month) {
      this.linked1 = '';
      this.linked2 = '';
    }
    else if (this.views[0].year < this.views[1].year) {
      this.linked1 = 'linked-before';
      this.linked2 = 'linked-after';
    }
    else if (this.views[1].year < this.views[0].year) {
      this.linked1 = 'linked-after';
      this.linked2 = 'linked-before';
    }
    else if (this.views[0].month < this.views[1].month) {
      this.linked1 = 'linked-before';
      this.linked2 = 'linked-after';
    }
    else if (this.views[1].month < this.views[0].month) {
      this.linked1 = 'linked-after';
      this.linked2 = 'linked-before';
    }
  }
}
