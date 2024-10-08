import { bindable } from 'aurelia-framework';
import './vd-input-calendar-v2.scss'

export class VdInputCalendarV2 {
  @bindable
  public weekNumbers: boolean = true;
  @bindable
  public highlighted: Date[] = [
    new Date(2024, 8, 13)
  ];
  @bindable
  public selectedFromDate?: Date;
  @bindable
  public selectedToDate?: Date;

  private monthNames: string[] = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'Mai',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Okt',
    'Nov',
    'Des'
  ];

  public get monthName(): string {
    return this.monthNames[this.month];
  };

  private year: number;
  private month: number;
  private mode: 'choose-date'|'choose-month' = 'choose-date';
  private get classes(): string {
    let result: string[] = [this.mode];
    if (this.weekNumbers) {
      result.push('week-numbers');
    }
    return result.join(' ');
  }

  constructor() {
    let date = new Date();
    this.year = date.getFullYear();
    this.month = date.getMonth();
  }

  private getWeekNumber(date: Date): number {
    date = new Date(date);
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    var week1 = new Date(date.getFullYear(), 0, 4);
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
      - 3 + (week1.getDay() + 6) % 7) / 7);
  }

  public get weeks() {
    let date = new Date(this.year, this.month, 1);
    let weekDay = (date.getDay() + 6) % 7;
    let result = [];
    date.setDate(-weekDay + 1);

    while (date.getMonth() == (this.month + 11) % 12 || date.getMonth() == this.month) {
      let week = {
        number: this.getWeekNumber(date),
        dates: []
      };

      for (let i = 0; i < 7; ++i) {
        let day = new Date(date);
        day.setDate(date.getDate() + i);
        let weekDay = (day.getDay()+6)%7+1;

        let classes = ['item', 'day-' + weekDay];
        if (day.getMonth() == this.month) {
          classes.push('this-month');
        } else {
          classes.push('other-month');
        }
        if (this.highlighted.some(a => +a == +day)) {
          classes.push('highlighted');
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
    let now = new Date();
    return this.monthNames.map((a, i) => {
      var classes = ['item'];
      if (i == now.getMonth() && this.year == now.getFullYear()) {
        classes.push('this-month');
      }
      return ({ id: i, name: a, classes: classes.join(' ') });
    });
  }

  public changePeriod(delta: number) {
    if (this.mode == 'choose-month') {
      this.year += delta;
    } else if (this.mode == 'choose-date') {
      this.month += delta;
      while (this.month < 0) {
        --this.year;
        this.month += 12;
      }
      while (this.month >= 12) {
        ++this.year;
        this.month -= 12;
      }
    }
  }

  public chooseMonth() {
    this.mode = 'choose-month';
  }

  public chooseDate(month) {
    if (typeof month == 'number') {
      this.month = month;
    }
    this.mode = 'choose-date';
  }

  public selectDate(day, date) {
    console.warn('selectDate', day, date);
  }
}
