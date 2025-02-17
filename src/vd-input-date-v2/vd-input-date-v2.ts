import { bindable } from 'aurelia-templating';
import './vd-input-date-v2.scss'
import { observable } from 'aurelia-binding';
import moment from 'moment';

export class VdInputDateV2 {
  @bindable
  public separator: string = '-';

  @bindable
  public value: Date;

  @bindable
  public usePopup: boolean = true;

  @bindable
  public popupToggled;

  @bindable
  public min?: Date;
  @bindable
  public max?: Date;

  private calendarMv;

  private segments: string[] = ['y', 'm', 'd'];

  private popupMode: 'hidden' | 'visible' = 'hidden';

  @observable
  private calendarValue: Date;

  private toggle() {
    if (this.popupMode == 'hidden') {
      this.popupMode = this.usePopup ? 'visible' : 'hidden';
    } else {
      this.popupMode = 'hidden';
    }
    this.popupToggled && this.popupToggled();
  }

  @observable
  private year: string = 'yyyy';
  @observable
  private month: string = 'mm';
  @observable
  private day: string = 'dd';

  private defaultYear: string;
  private defaultMonth: string;
  private defaultDate: string;
  private maxDate: number = 31;

  private padLeft(s: any, l: number, c?: string): string {
    c ||= '0';
    s = [...Array(l)].map(a => c).join('') + s;
    return s.substring(s.length - l);
  }

  constructor() {
    var d = new Date();
    this.defaultYear = this.padLeft('' + d.getFullYear(), 4);
    this.defaultMonth = this.padLeft('' + (1 + d.getMonth()), 2);
    this.defaultDate = this.padLeft('' + d.getDate(), 2);
  }

  private blurred() {
    this.popupMode = 'hidden';
  }

  private valueChanged(newValue, oldValue) {
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
    return !!(''+s).match(/^\d+$/);
  }

  private get isValidDate(): boolean {
    return this.isNumber(this.year) && this.isNumber(this.month) && this.isNumber(this.day);
  }

  private yearChanged() {
    if (this.usePopup && this.year && this.calendarMv?.au.controller.viewModel) {
      this.calendarMv.au.controller.viewModel.year = +this.year;
    }
    if (this.isValidDate) {
      this.value = new Date(+this.year, +this.month -1, +this.day);
    }
  }

  private monthChanged() {
    if (this.usePopup && this.year && this.calendarMv?.au.controller.viewModel) {
      this.calendarMv.au.controller.viewModel.month = +this.month-1;
    }
    if (this.isNumber(this.year) && this.isNumber(this.month)) {
      var m = moment(`${this.year}-${this.padLeft(this.month,2)}-01`);
      this.maxDate = m.daysInMonth();
    }
    if (this.isValidDate) {
      this.value = new Date(+this.year, +this.month -1, +this.day);
    }
  }

  private dayChanged() {
    if (this.isValidDate) {
      this.value = new Date(+this.year, +this.month -1, +this.day);
    }
  }

  private calendarValueChanged() {
    let d = this.calendarValue;
    this.year = ''+d.getFullYear();
    this.month = ''+(d.getMonth()+1);
    this.day = ''+d.getDate();
  }
}
