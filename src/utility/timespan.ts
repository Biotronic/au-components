import moment from 'moment';

const MILLIS_PER_SECOND = 1000;
const MILLIS_PER_MINUTE = MILLIS_PER_SECOND * 60;   //     60,000
const MILLIS_PER_HOUR = MILLIS_PER_MINUTE * 60;     //  3,600,000
const MILLIS_PER_DAY = MILLIS_PER_HOUR * 24;        // 86,400,000
const DEFAULT_FORMAT = 'HH:mm';
const DEFAULT_DAY_FORMAT = 'd\\d HH:mm';

export class TimeSpan {
    private _millis: number;

    private static interval(value: number, scale: number): TimeSpan {
        if (Number.isNaN(value)) {
            throw new Error('value can\'t be NaN');
        }

        const tmp = value * scale;
        const millis = Math.trunc(tmp + (value >= 0 ? 0.5 : -0.5));
        if ((millis > TimeSpan.maxValue.totalMilliseconds) || (millis < TimeSpan.minValue.totalMilliseconds)) {
            throw new Error('TimeSpanTooLong');
        }

        return new TimeSpan(millis);
    }

    private static timeToMilliseconds(hour: number, minute: number, second: number): number {
        const totalSeconds = (hour * 3600) + (minute * 60) + second;
        if (totalSeconds > TimeSpan.maxValue.totalSeconds || totalSeconds < TimeSpan.minValue.totalSeconds) {
            throw new Error('TimeSpanTooLong');
        }

        return totalSeconds * MILLIS_PER_SECOND;
    }

    public static get zero(): TimeSpan {
        return new TimeSpan(0);
    }

    public static get maxValue(): TimeSpan {
        return new TimeSpan(Number.MAX_SAFE_INTEGER);
    }

    public static get minValue(): TimeSpan {
        return new TimeSpan(Number.MIN_SAFE_INTEGER);
    }

    public static fromDays(value: number): TimeSpan {
        return TimeSpan.interval(value, MILLIS_PER_DAY);
    }

    public static fromHours(value: number): TimeSpan {
        return TimeSpan.interval(value, MILLIS_PER_HOUR);
    }

    public static fromMilliseconds(value: number): TimeSpan {
        return TimeSpan.interval(value, 1);
    }

    public static fromMinutes(value: number): TimeSpan {
        return TimeSpan.interval(value, MILLIS_PER_MINUTE);
    }

    public static fromSeconds(value: number): TimeSpan {
        return TimeSpan.interval(value, MILLIS_PER_SECOND);
    }

    public static hasValue(obj: any) {
        return (obj !== null && typeof obj !== 'undefined');
    }
    
    public static hasValues<T>(obj: T, ...keys: (keyof T)[]) {
        return keys.every(k => TimeSpan.hasValue(obj[k]));
    }

    public static fromString(s: string): TimeSpan {
        if (!TimeSpan.hasValue(s)) { return null; }

        const re = /^(?<sign>-?)(?:(?<days>\d+)\.)?(?<hours>\d+):(?<minutes>\d+)(?::(?<seconds>\d+))?(?:\.(?<fraction>\d+))?$/gm;
        const matches = re.exec(s);

        if (!matches || matches.length !== 7) {
            return null;
        }

        const ms = (parseInt(matches[2]) * 86400000 || 0) +
            (parseInt(matches[3]) * 3600000 || 0) +
            (parseInt(matches[4]) * 60000 || 0) +
            (parseInt(matches[5]) * 1000 || 0) +
            (parseInt(matches[6]) || 0);
        return new TimeSpan(ms * (matches[1] === '' ? 1 : -1));
    }

    public static fromTime(hours: number, minutes: number, seconds: number): TimeSpan;
    public static fromTime(days: number, hours: number, minutes: number, seconds: number, milliseconds: number): TimeSpan;
    public static fromTime(daysOrHours: number, hoursOrMinutes: number, minutesOrSeconds: number, seconds?: number, milliseconds?: number): TimeSpan {
        if (milliseconds != undefined) {
            return this.fromTimeStartingFromDays(daysOrHours, hoursOrMinutes, minutesOrSeconds, seconds, milliseconds);
        } else {
            return this.fromTimeStartingFromHours(daysOrHours, hoursOrMinutes, minutesOrSeconds);
        }
    }

    private static fromTimeStartingFromHours(hours: number, minutes: number, seconds: number): TimeSpan {
        const millis = TimeSpan.timeToMilliseconds(hours, minutes, seconds);
        return new TimeSpan(millis);
    }

    private static fromTimeStartingFromDays(days: number, hours: number, minutes: number, seconds: number, milliseconds: number): TimeSpan {
        const totalMilliSeconds = (days * MILLIS_PER_DAY) +
            (hours * MILLIS_PER_HOUR) +
            (minutes * MILLIS_PER_MINUTE) +
            (seconds * MILLIS_PER_SECOND) +
            milliseconds;

        if (totalMilliSeconds > TimeSpan.maxValue.totalMilliseconds || totalMilliSeconds < TimeSpan.minValue.totalMilliseconds) {
            throw new Error('TimeSpanTooLong');
        }
        return new TimeSpan(totalMilliSeconds);
    }

    public static fromDateDifference(from: Date, to: Date): TimeSpan {
        from = moment(from).toDate();
        to = moment(to).toDate();
        return new TimeSpan(+from - +to);
    }

    public lessThan(other: TimeSpan): boolean {
        return this._millis < other._millis;
    }

    public lessThanOrEqual(other: TimeSpan): boolean {
        return this._millis <= other._millis;
    }

    public moreThan(other: TimeSpan): boolean {
        return this._millis > other._millis;
    }

    public moreThanOrEqual(other: TimeSpan): boolean {
        return this._millis >= other._millis;
    }

    public equals(other: TimeSpan): boolean {
        return this._millis == other._millis;
    }

    public doesNotEqual(other: TimeSpan): boolean {
        return this._millis != other._millis;
    }

    constructor(millis: number) {
        this._millis = millis;
    }

    public get weeks(): number {
        return Math.trunc(this._millis / MILLIS_PER_DAY / 7);
    }

    public get days(): number {
        return Math.trunc(this._millis / MILLIS_PER_DAY);
    }

    public get hours(): number {
        return Math.trunc((this._millis / MILLIS_PER_HOUR) % 24);
    }

    public get minutes(): number {
        return Math.trunc((this._millis / MILLIS_PER_MINUTE) % 60);
    }

    public get seconds(): number {
        return Math.trunc((this._millis / MILLIS_PER_SECOND) % 60);
    }

    public get milliseconds(): number {
        return Math.trunc(this._millis % 1000);
    }

    public get totalDays(): number {
        return Math.trunc(this._millis / MILLIS_PER_DAY);
    }

    public get totalHours(): number {
        return Math.trunc(this._millis / MILLIS_PER_HOUR);
    }

    public get totalMinutes(): number {
        return Math.trunc(this._millis / MILLIS_PER_MINUTE);
    }

    public get totalSeconds(): number {
        return Math.trunc(this._millis / MILLIS_PER_SECOND);
    }

    public get totalMilliseconds(): number {
        return Math.trunc(this._millis);
    }

    public get empty(): boolean {
        return this._millis === 0;
    }

    public compare(ts: TimeSpan): number {
        return this._millis - ts._millis;
    }

    public add(ts: TimeSpan): TimeSpan {
        if (ts == null) {
            return new TimeSpan(this._millis);
        }
        const result = this._millis + ts._millis;
        return new TimeSpan(result);
    }

    public addToDate(d: Date): Date {
        d = new Date(d);
        d.setMilliseconds(d.getMilliseconds() + this._millis);
        return d;
    }

    public subtract(ts: TimeSpan): TimeSpan {
        const result = this._millis - ts.totalMilliseconds;
        return new TimeSpan(result);
    }

    public subFromDate(d: Date): Date {
        d = new Date(d);
        d.setMilliseconds(d.getMilliseconds() - this._millis);
        return d;
    }

    public toString(format: string = null): string {
        if (isNaN(this._millis)) {
            return 'NaN';
        }
        var tmp = this._millis;
        var d = Math.trunc(tmp / MILLIS_PER_DAY);
        tmp -= d * MILLIS_PER_DAY;
        var h = Math.trunc(tmp / MILLIS_PER_HOUR);
        tmp -= h * MILLIS_PER_HOUR;
        var m = Math.trunc(tmp / MILLIS_PER_MINUTE);
        tmp -= m * MILLIS_PER_MINUTE;
        var s = Math.trunc(tmp / MILLIS_PER_SECOND);
        var fffffff = Math.trunc(tmp * 10000);
        if (format == null) {
            format = d > 0 ? DEFAULT_DAY_FORMAT : DEFAULT_FORMAT;
        }

        var result = '';
        for (let i = 0; i < format.length; i++) {
            var pad = 1;
            while (format[i + pad] == format[i]) {
                ++pad;
            }
            switch (format[i].toLowerCase()) {
                case 'd':
                    result += d.toFixed().padStart(pad, '0');
                    break;
                case 'h':
                    result += h.toFixed().padStart(pad, '0');
                    break;
                case 'm':
                    result += m.toFixed().padStart(pad, '0');
                    break;
                case 's':
                    result += s.toFixed().padStart(pad, '0');
                    break;
                case 'f':
                    result += fffffff.toFixed().padStart(7, '0').slice(0, pad);
                    break;
                case '\'':
                    ++i;
                    while (i < format.length && format[i] != '\'') {
                        result += format[i];
                        ++i;
                    }
                    break;
                case '\\':
                    ++i;
                default:
                    result += format[i];
                    continue;
            }
            i += pad - 1;
        }
        return result;
    }

    public toLongString(format: { weeks?: boolean, days?: boolean, totalHours?: boolean, hours?: boolean, minutes?: boolean, seconds?: boolean, milliseconds?: boolean } = null): string {
        if (isNaN(this._millis)) {
            return 'NaN';
        }
        if (this._millis == 0) {
            return '0 minutter';
        }

        format = Object.assign({
            weeks: false,
            days: !format?.totalHours,
            totalHours: false,
            hours: true,
            minutes: true,
            seconds: false,
            milliseconds: false
        }, format || {});

        if (format.weeks && format.totalHours) {
            //log.error('Invalid format: can\'t have both weeks and totalHours');
        }
        if (format.days && format.totalHours) {
            //log.error('Invalid format: can\'t have both days and totalHours');
        }

        var result = [];
        if (format.weeks && this.weeks) {
            if (this.weeks == 1) {
                result.push('1 uke');
            } else {
                result.push(`${this.weeks} uker`);
            }
        }
        if (format.days && this.days) {
            let days = this.days;
            if (format.weeks) {
                days %= 7;
            }
            if (days == 1) {
                result.push('1 dag');
            } else if (days) {
                result.push(`${days} dager`);
            }
        }
        if (format.totalHours && this.totalHours) {
            if (this.totalHours == 1) {
                result.push('1 time');
            } else {
                result.push(`${Math.floor(this.totalHours)} timer`);
            }
        } else if (format.hours && this.hours) {
            if (this.hours == 1) {
                result.push('1 time');
            } else {
                result.push(`${this.hours} timer`);
            }
        }
        if (format.minutes && this.minutes) {
            if (this.minutes == 1) {
                result.push('1 minutt');
            } else {
                result.push(`${this.minutes} minutter`);
            }
        }
        if (format.seconds && this.seconds) {
            if (this.seconds == 1) {
                result.push('1 sekund');
            } else {
                result.push(`${this.seconds} sekunder`);
            }
        }
        if (format.milliseconds && this.milliseconds) {
            if (this.milliseconds == 1) {
                result.push('1 millisekund');
            } else {
                result.push(`${this.milliseconds} millisekunder`);
            }
        }

        let s = '';
        for (let i = 0; i < result.length; ++i) {
            if (i > 0) {
                if (i == result.length - 1) {
                    s += ' og ';
                } else {
                    s += ', ';
                }
            }
            s += result[i];
        }

        return s;
    }

    public static average(spans: TimeSpan[]): TimeSpan {
        return new TimeSpan(
            spans.reduce((sum, span) => sum + span._millis, 0) / spans.length
        );
    }

    public static sum(spans: TimeSpan[]): TimeSpan {
        return new TimeSpan(
            spans.reduce((sum, span) => sum + span._millis, 0)
        );
    }
}
