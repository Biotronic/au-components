import { bindable, observable } from 'aurelia-framework';
import './vd-input-calendar-v2.scss'
import { VdSingleCarouselV2 } from '../vd-single-carousel-v2/vd-single-carousel-v2';
import moment from 'moment';

export class VdInputCalendarV2 {
  @bindable
  public weekNumbers = true;
  @bindable
  public highlightedDates: Date[] = [
    new Date(2025, 1, 17)
  ];

  @bindable
  public mode: 'range' | 'single' | 'multi' = 'single';
  @bindable
  public selectedDate?: Date;
  @bindable
  public selectedDates: Date[] = [];

  @bindable
  public min?: Date;
  @bindable
  public max?: Date;

  @observable
  public year: number;
  @observable
  public month: number;

  @bindable
  public change: (dates: Date[]) => void = () => {};

  @bindable
  public viewChanged: (view: { year: number, month: number }) => void = () => {};

  private monthNames: string[] = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ];

  public get monthName(): string {
    return this.monthNames[this.month];
  };

  private monthCarouselMv: VdSingleCarouselV2;
  private dateCarouselMv: VdSingleCarouselV2;

  private selectMode: 'choose-date' | 'choose-month' = 'choose-date';
  private get classes(): string {
    const result: string[] = [this.selectMode, this.mode];
    if (this.weekNumbers) {
      result.push('week-numbers');
    }
    if (this.mode == 'range' && this.selectedDates.length > 0) {
      const w = this.weeks;
      const firstDate = w[0].dates[0].date;
      const lastDate = w[w.length - 1].dates[w[w.length - 1].dates.length - 1].date;
      const otherDate = this.selectedDates[this.selectedDates.length - 1];
      if (+firstDate > +otherDate) {
        result.push('range-start-before');
      }
      if (+lastDate < +otherDate) {
        result.push('range-start-after');
      }
    }
    return result.join(' ');
  }

  constructor() {
    let date = new Date();
    this.year = date.getFullYear();
    this.month = date.getMonth();
  }

  private yearChanged(newValue: number, oldValue: number) {
    if (oldValue === undefined) { return; }
    this.monthCarouselMv.move(newValue - oldValue);
    this.dateCarouselMv.move(newValue - oldValue);
    this.viewChanged && this.viewChanged({ year: this.year, month: this.month+1 });
  }

  private monthChanged(newValue: number, oldValue: number) {
    if (oldValue === undefined) { return; }
    let delta = newValue - oldValue;
    if (newValue == 11 && oldValue == 0) {
      delta = -1;
    }
    if (newValue == 0 && oldValue == 11) {
      delta = 1;
    }
    this.dateCarouselMv.move(delta);
    this.viewChanged && this.viewChanged({ year: this.year, month: this.month+1 });
  }

  private selectedDatesChanged() {
    if (!this.selectedDates) {
      this.selectedDates = [];
    }
  }

  private getWeekNumber(date: Date): number {
    date = new Date(date);
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    const week1 = new Date(date.getFullYear(), 0, 4);
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
      - 3 + (week1.getDay() + 6) % 7) / 7);
  }

  public get weeks() {
    const date = new Date(this.year, this.month, 1);
    const weekDay = (date.getDay() + 6) % 7;
    const result = [];
    date.setDate(-weekDay + 1);

    while (date.getMonth() == (this.month + 11) % 12 || date.getMonth() == this.month) {
      const week = {
        number: this.getWeekNumber(date),
        dates: [] as {
          date: Date,
          text: number,
          classes: string
        }[]
      };

      for (let i = 0; i < 7; ++i) {
        const day = new Date(date);
        day.setDate(date.getDate() + i);
        const weekDay = (day.getDay() + 6) % 7 + 1;

        const classes = ['item', 'day', 'day-' + weekDay];
        if (day.getMonth() == this.month) {
          classes.push('this-month');
        } else {
          classes.push('other-month');
        }
        if (this.highlightedDates.some(a => +a == +day)) {
          classes.push('highlighted');
        }
        if (this.min && +day < +moment(this.min).toDate()) {
          classes.push('disabled');
        }
        if (this.max && +day > +moment(this.max).toDate()) {
          classes.push('disabled');
        }
        // Single select
        if (this.mode == 'single' && +this.selectedDate == +day) {
          classes.push('selected');
        }
        // Multiselect or range
        if (this.mode != 'single' && this.selectedDates.some(a => +a == +day)) {
          classes.push('selected');
        }
        // Range
        if (this.mode == 'range' && this.selectedDates.length > 0) {
          if (this.selectedDates.length == 2) {
            const ordered = [...this.selectedDates].sort((a, b) => +a - +b);
            if (+day > +ordered[0] && +day < +ordered[1]) {
              classes.push('highlight-range');
            }
          }
          if (+day == +this.selectedDates[this.selectedDates.length - 1]) {
            classes.push('range-start');
          }
        }
        week.dates.push({
          date: day,
          text: day.getDate(),
          classes: classes.join(' ')
        });
      }

      result.push(week);
      date.setDate(date.getDate() + 7);
    }
    return result;
  }

  public get months() {
    const now = new Date();
    return this.monthNames.map((a, i) => {
      const classes = ['item', 'month'];
      if (i == now.getMonth() && this.year == now.getFullYear()) {
        classes.push('this-month');
      }
      return ({ id: i, name: a, classes: classes.join(' ') });
    });
  }

  public changePeriod(delta: number) {
    if (this.selectMode == 'choose-month') {
      this.year += delta;
    } else if (this.selectMode == 'choose-date') {
      let month = this.month + delta;
      while (month < 0) {
        --this.year;
        month += 12;
      }
      while (month >= 12) {
        ++this.year;
        month -= 12;
      }
      this.month = month;
    }
    this.viewChanged && this.viewChanged({ year: this.year, month: this.month+1 });
  }

  public chooseMonth() {
    this.selectMode = 'choose-month';
  }

  public chooseDate(month : number) {
    if (typeof month == 'number') {
      this.month = month;
    }
    this.selectMode = 'choose-date';
  }

  public selectDate(date: Date) {
    if (this.mode == 'single') {
      this.selectedDate = date;
      this.selectedDates = [date];
      this.change && this.change(this.selectedDates);
    }
    if (this.mode == 'multi') {
      const i = this.selectedDates.findIndex(a => +a == +date);
      if (i > -1) {
        this.selectedDates = [...this.selectedDates.slice(0, i), ...this.selectedDates.slice(i + 1, this.selectedDates.length)];
      } else {
        this.selectedDates = [...this.selectedDates, date];
      }
      this.change && this.change(this.selectedDates);
    }
    if (this.mode == 'range') {
      this.selectedDates.push(date);
      while (this.selectedDates.length > 2) {
        this.selectedDates.splice(0, 1);
      }
      this.change && this.change(this.selectedDates);
    }
  }
}
