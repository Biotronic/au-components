import { bindable, bindingMode, observable } from 'aurelia-framework';
import './vd-input-time-v2.scss'
import { TimeSpan } from '../utility/timespan';

export class VdInputTimeV2 {
  @bindable
  public separator: string = ':';
  @bindable
  public days: boolean = false;
  @bindable
  public seconds: boolean = false;

  @bindable
  public value: TimeSpan;

  @bindable
  public defaultValue: TimeSpan;
  
  @bindable
  public min: TimeSpan;
  @bindable
  public max: TimeSpan;
  @bindable
  public step: TimeSpan;

  private element: HTMLElement;
  private minDays: number = 0;
  private maxDays: number;
  private minHours: number = 0;
  private maxHours: number = 23;
  private minMinutes: number = 0;
  private maxMinutes: number = 59;
  private minSeconds: number = 0;
  private maxSeconds: number = 59;
  private defaultDays: number = 0;
  private defaultHours: number = 0;
  private defaultMinutes: number = 0;
  private defaultSeconds: number = 0;
  private stepDays: number = 1;
  private stepHours: number = 1;
  private stepMinutes: number = 1;
  private stepSeconds: number = 1;

  @observable
  private daysValue: number;
  @observable
  private hoursValue: number;
  @observable
  private minutesValue: number;
  @observable
  private secondsValue: number;

  private get minValue(): TimeSpan {
    if (typeof this.min == 'string') {
      return TimeSpan.fromString(this.min);
    } else {
      return this.min;
    }
  }
  private get maxValue(): TimeSpan {
    if (typeof this.max == 'string') {
      return TimeSpan.fromString(this.max);
    } else {
      return this.max;
    }
  }

  private daysValueChanged() { this.partChanged(); }

  private hoursValueChanged() { this.partChanged(); }

  private minutesValueChanged() { this.partChanged(); }

  private secondsValueChanged() { this.partChanged(); }

  private partChanged() {
    if (this.days && this.daysValue === undefined) {
      this.value = undefined;
      return;
    }
    if (this.seconds && this.secondsValue === undefined) {
      this.value = undefined;
      return;
    }
    let d = this.days ? this.daysValue * 86400 : 0;
    let h = this.hoursValue * 3600;
    let m = this.minutesValue * 60;
    let s = this.seconds ? this.secondsValue : 0;

    var v = d+h+m+s;
    if (!isNaN(v)) {
      let result = TimeSpan.fromSeconds(v);

      if (result.lessThan(this.minValue)) {
        result = undefined;
      } else if (result.moreThan(this.maxValue)) {
        result = undefined;
      }

      this.value = result;
    } else {
      this.value = undefined;
    }
  }

  constructor() {
  }

  private maxChanged() {
    if (!this.max) {
      this.maxDays = undefined;
      this.maxHours = undefined;
      this.maxMinutes = undefined;
      this.maxSeconds = undefined;
      return;
    }
    let v = this.max;
    if (typeof v == 'string') {
      v = TimeSpan.fromString(v);
    }
    if (this.days) {
      this.maxDays = v.days;
      this.maxHours = v.days >= 1 ? v.hours: 23;
    } else {
      this.maxHours = v.totalHours;
    }
    this.maxMinutes = v.totalHours >= 1 ? undefined : v.minutes;
    this.maxSeconds = v.totalMinutes >= 1 ? undefined : v.seconds;
  }

  private minChanged() {
    this.defaultValueChanged();
    if (!this.min) {
      this.minDays = undefined;
      this.minHours = undefined;
      this.minMinutes = undefined;
      this.minSeconds = undefined;
      return;
    }
    let v = this.min;
    if (typeof v == 'string') {
      v = TimeSpan.fromString(v);
    }
    if (this.days) {
      this.minDays = v.days;
      this.minHours = v.days >= 1 ? v.hours: 23;
    } else {
      this.minHours = v.totalHours;
    }
    this.minMinutes = v.totalHours >= 1 ? undefined : v.minutes;
    this.minSeconds = v.totalMinutes >= 1 ? undefined : v.seconds;
  }

  private stepChanged() {
    if (!this.step) {
      this.stepDays = undefined;
      this.stepHours = undefined;
      this.stepMinutes = undefined;
      this.stepSeconds = undefined;
      return;
    }
    let v = this.step;
    if (typeof v == 'string') {
      v = TimeSpan.fromString(v);
    }
    if (this.days) {
      this.stepDays = v.days;
      this.stepHours = v.days >= 1 ? v.hours: 23;
    } else {
      this.stepHours = v.totalHours;
    }
    this.stepMinutes = v.totalHours >= 1 ? undefined : v.minutes;
    this.stepSeconds = v.totalMinutes >= 1 ? undefined : v.seconds;
  }

  private defaultValueChanged() {
    let v = this.defaultValue || this.minValue;
    if (!v) {
      this.defaultDays = 0;
      this.defaultHours = 0;
      this.defaultMinutes = 0
      this.defaultSeconds = 0;
      return;
    }
    if (typeof v == 'string') {
      v = TimeSpan.fromString(v);
    }
    if (this.days) {
      this.defaultDays = v.days;
      this.defaultHours = v.hours;
    } else {
      this.defaultDays = 0;
      this.defaultHours = v.totalHours;
    }
    this.defaultMinutes = v.minutes;
    this.defaultSeconds = v.seconds;
  }
  
  private popped: 'visible' | 'hidden' = 'hidden'
  private toggle() {
    this.popped = this.popped == 'hidden' ? 'visible' : 'hidden';
  }

  private handleFocusOut() {
    setTimeout(() => {
      if (!this.element.matches(':focus-within')) {
        //this.popupMode = 'hidden';
      }
    }, 0);
  }
}
