import moment from 'moment';

export class TimeFormatValueConverter {
  public toView(value: any, ...args: string[]) {
    if (!value) {
      return '-';
    }

    var utc = args.indexOf('utc') > -1;
    var seconds = args.indexOf('seconds') > -1;

    let date = utc ? moment.utc(value) : moment(value);
    if (date.year() == 1) {
      return '-';
    }

    let format = seconds ? 'HH:mm:ss' : 'HH:mm';
    return date.format(format);
  }
}
