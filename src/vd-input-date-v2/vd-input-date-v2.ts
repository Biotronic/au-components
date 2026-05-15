import { bindable } from 'aurelia-templating';
import './vd-input-date-v2.scss'
import { observable } from 'aurelia-binding';
import moment from 'moment';
import { VdInputCalendarV2 } from 'vd-input-calendar-v2/vd-input-calendar-v2';

export class VdInputDateV2 {
  @bindable
  public separator: string = '-';

  @bindable
  public value: Date;

  @bindable
  public usePopup: boolean = true;

  @bindable
  public popupToggled;
  private popupOpen = false;

  @bindable
  public min?: Date;
  @bindable
  public max?: Date;

  private element: HTMLElement;
  private calendarMv: { au: { controller: { viewModel: VdInputCalendarV2 } } };
  @bindable
  private calendarMvAlt: { au: { controller: { viewModel: VdInputCalendarV2 } } };

  private segments: string[] = ['y', 'm', 'd'];

  @observable
  private calendarValue: Date;

  private togglePopup(state?: boolean) {
    if (state !== undefined) {
      this.popupOpen = state;
    } else {
      this.popupOpen = !this.popupOpen;
    }
    this.element.querySelector('input')?.focus();
    if (this.popupToggled) {
      this.popupToggled();
    }
  }

  @observable
  private year = 'yyyy';
  @observable
  private month = 'mm';
  @observable
  private day = 'dd';

  private defaultYear: string;
  private defaultMonth: string;
  private defaultDate: string;
  private maxDate = 31;

  private padLeft(s: any, l: number, c?: string): string {
    c ||= '0';
    s = [...Array(l)].map(a => c).join('') + s;
    return s.substring(s.length - l);
  }

  constructor() {
    const d = new Date();
    this.defaultYear = this.padLeft('' + d.getFullYear(), 4);
    this.defaultMonth = this.padLeft('' + (1 + d.getMonth()), 2);
    this.defaultDate = this.padLeft('' + d.getDate(), 2);
  }

  private valueChanged(newValue: Date, oldValue: Date) {
    if (this.value) {
      this.year = this.padLeft(this.value.getFullYear(), 4);
      this.month = this.padLeft(this.value.getMonth() + 1, 2);
      this.day = this.padLeft(this.value.getDate(), 2);
    } else {
      this.year = 'yyyy';
      this.month = 'mm';
      this.day = 'dd';
    }
  }

  private isNumber(s: any): boolean {
    return !!('' + s).match(/^\d+$/);
  }

  private get isValidDate(): boolean {
    return this.isNumber(this.year) && this.isNumber(this.month) && this.isNumber(this.day);
  }

  private get calVm(): VdInputCalendarV2 {
    return (this.calendarMvAlt || this.calendarMv)?.au.controller.viewModel;
  }

  private updating = false;
  private yearChanged() {
    if (this.updating) {
      return;
    }
    if (this.year && this.calVm) {
      this.calVm.year = +this.year;
    }
    if (this.isValidDate) {
      this.updating =  true;
      this.value = new Date(+this.year, +this.month - 1, +this.day);
      this.calVm.selectedDate = this.value;
      this.calVm.selectedDates = [this.value];
      this.updating =  false;
    }
  }

  private monthChanged() {
    if (this.updating) {
      return;
    }
    if (this.year && this.month && this.calVm) {
      this.calVm.month = +this.month - 1;
    }
    if (this.isNumber(this.year) && this.isNumber(this.month)) {
      const m = moment(`${this.year}-${this.padLeft(this.month, 2)}-01`);
      this.maxDate = m.daysInMonth();
    }
    if (this.isValidDate) {
      this.updating =  true;
      this.value = new Date(+this.year, +this.month - 1, +this.day);
      this.calVm.selectedDate = this.value;
      this.calVm.selectedDates = [this.value];
      this.updating =  false;
    }
  }

  private dayChanged() {
    if (this.updating) {
      return;
    }
    if (this.isValidDate) {
      this.updating =  true;
      this.value = new Date(+this.year, +this.month - 1, +this.day);
      this.calVm.selectedDate = this.value;
      this.calVm.selectedDates = [this.value];
      this.updating =  false;
    }
  }

  private calendarValueChanged() {
    const d = this.calendarValue;
    this.year = '' + d.getFullYear();
    this.month = '' + (d.getMonth() + 1);
    this.day = '' + d.getDate();
  }
}
