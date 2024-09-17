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

  public get monthName(): string {
    return [
      'Januar',
      'Februar',
      'Mars',
      'April',
      'Mai',
      'Juni',
      'Juli',
      'August',
      'September',
      'Oktober',
      'November',
      'Desember'
    ][this.month];
  };

  private year: number;
  private month: number;

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
      console.warn(date);
      let week = {
        number: this.getWeekNumber(date),
        dates: []
      };

      for (let i = 0; i < 7; ++i) {
        let day = new Date(date);
        day.setDate(date.getDate() + i);
        let weekDay = day.getDay();

        let classes = ['day', 'day-'+weekDay];
        if (day.getMonth() == this.month) {
          classes.push('this-month');
        } else {
          classes.push('other-month');
        }
        if (this.highlighted.some(a => a == day)) {
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

  public changeMonth(delta: number) {
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
