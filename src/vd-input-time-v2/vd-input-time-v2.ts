import { bindable, bindingMode } from 'aurelia-framework';
import './vd-input-time-v2.scss'
import { TimeSpan } from 'utility/timespan';

export class VdInputTimeV2 {
  @bindable
  public days: boolean = false;
  @bindable
  public seconds: boolean = false;
  @bindable
  public min: TimeSpan | string = '00:00';
  @bindable
  public max: TimeSpan | string = '23:59';
  @bindable
  public step: TimeSpan | string = '00:01';
  @bindable
  public options: any;

  @bindable({ mode: bindingMode.twoWay })
  public value: TimeSpan;

  private daysElement: HTMLInputElement;
  private hoursElement: HTMLInputElement;
  private minutesElement: HTMLInputElement;
  private secondsElement: HTMLInputElement;
  private popupElement: HTMLDivElement;
  private valueUpdating: boolean = false;
  private isAttached: boolean = false;

  private get minValue(): TimeSpan {
    return (typeof this.min === 'string' ? TimeSpan.fromString(this.min) : this.min as TimeSpan) || TimeSpan.fromString('00:00');
  }
  private get maxValue(): TimeSpan {
    return (typeof this.max === 'string' ? TimeSpan.fromString(this.max) : this.max as TimeSpan) || TimeSpan.fromString('99.23:59:59');
  }
  private get stepValue(): TimeSpan {
    return (typeof this.step === 'string' ? TimeSpan.fromString(this.step) : this.step as TimeSpan) || TimeSpan.fromString('00:01');
  }
  private get dayList(): number[] {
    let min = this.minValue.days;
    let max = this.maxValue.days;
    let step = this.stepValue.days || 1;
    let count = Math.ceil((max - min + 1) / step);
    return [...Array.from(Array(count).keys()).map(a => a * step + min)];
  }
  private get hourList(): number[] {
    let min = this.minValue.totalHours;
    let max = this.maxValue.totalHours;
    if (this.days && this.maxValue.totalHours - this.minValue.totalHours > 23) {
      min = 0;
      max = 23;
    }
    let step = this.stepValue.hours || 1;
    let count = Math.ceil((max - min + 1) / step);
    return [...Array.from(Array(count).keys()).map(a => a * step + min)];
  }
  private get minuteList(): number[] {
    let min = this.minValue.minutes;
    let max = this.maxValue.minutes;
    if (this.maxValue.totalMinutes - this.minValue.totalMinutes > 59) {
      min = 0;
      max = 59;
    }
    let step = this.stepValue.minutes || 1;
    let count = Math.ceil((max - min + 1) / step);
    return [...Array.from(Array(count).keys()).map(a => a * step + min)];
  }
  private get secondList(): number[] {
    let min = this.minValue.seconds;
    let max = this.maxValue.seconds;
    if (this.maxValue.totalSeconds - this.minValue.totalSeconds > 59) {
      min = 0;
      max = 59;
    }
    let step = this.stepValue.seconds || 1;
    let count = Math.ceil((max - min + 1) / step);
    return [...Array.from(Array(count).keys()).map(a => a * step + min)];
  }

  valueChanged(newValue) {
    if (this.valueUpdating) return;
    if (!this.isAttached) return;
    this.valueUpdating = true;
    let value = typeof newValue == 'string' ? TimeSpan.fromString(newValue) : newValue as TimeSpan;
    if (this.days) {
      this.daysElement.value = ('00' + value.days).slice(-2);
      this.hoursElement.value = ('00' + value.hours).slice(-2);
    } else {
      this.hoursElement.value = ('00' + Math.floor(value.totalHours)).slice(-2);
    }
    this.minutesElement.value = ('00' + value.minutes).slice(-2);
    if (this.seconds) {
      this.secondsElement.value = ('00' + value.seconds).slice(-2);
    }
    if (this.days) { this.cleanup(this.daysElement, 0); }
    this.cleanup(this.hoursElement, 0);
    this.cleanup(this.minutesElement, 0);
    if (this.seconds) { this.cleanup(this.secondsElement, 0); }
    this.valueUpdating = false;
  }

  attached() {
    this.isAttached = true;
    let inputs = [this.daysElement, this.hoursElement, this.minutesElement, this.secondsElement]
      .filter(a => !!a);
    for (let input of inputs) {
      input.addEventListener('focus', this.inputFocus.bind(this));
      input.addEventListener('blur', this.inputBlur.bind(this));
      input.addEventListener('input', this.inputChange.bind(this));
      input.addEventListener('keydown', this.inputKeyDown.bind(this));
    }
    this.valueChanged(this.value);
    this.popupElement.addEventListener('focusout', this.popupBlur.bind(this));
    this.popupElement.addEventListener('keydown', this.popupKeydown.bind(this));
  }

  private inputFocus(e: FocusEvent) {
    let input = e.target as HTMLInputElement;
    input.setSelectionRange(0, 2, 'none');
  }
  private inputBlur(e: FocusEvent) {
    this.cleanup(e.target as HTMLInputElement);
  }

  private cleanup(input: HTMLInputElement, delta?: number) {
    if (input.value.replace(/\D/g, '') == '' && (!delta && delta != 0)) {
      input.value = '--';
      return;
    }
    let constraints = this.getConstraints(input);
    if (constraints.step == 0) {
      input.value = '00';
      return;
    }
    let value = +input.value + delta;
    if (isNaN(value)) {
      if (delta > 0) {
        value = constraints.min;
      } else if (delta < 0) {
        value = constraints.max;
      } else {
        value = +input.value;
      }
    }
    value = Math.round((value - constraints.min) / constraints.step) * constraints.step + constraints.min;
    value = Math.max(constraints.min, Math.min(value, constraints.max));

    input.value = ('00' + value).slice(-2);

    let inputs = [this.daysElement, this.hoursElement, this.minutesElement, this.secondsElement];
    let states = inputs.map(a => (a?.value || '0').replace(/\D/g, '') == '');
    if (!this.valueUpdating && !states.filter(a => a).length) {
      this.value = this.getValue();
    }
  }

  private inputChange(e: Event) {
    let input = e.target as HTMLInputElement;

    input.value = input.value.replace(/[^\d]/g, '');

    if (input.selectionEnd >= 2) {
      let inputs = [this.daysElement, this.hoursElement, this.minutesElement, this.secondsElement]
        .filter(a => !!a);
      let idx = inputs.indexOf(input);
      if (idx < inputs.length - 1) {
        inputs[idx + 1].focus();
      }
    }
  }

  private inputKeyDown(e: KeyboardEvent) {
    let input = e.target as HTMLInputElement;
    let constraints = this.getConstraints(input);
    if (e.key == 'ArrowUp') {
      this.cleanup(input, constraints.step);
    }
    if (e.key == 'ArrowDown') {
      this.cleanup(input, -constraints.step);
    }
    if (e.key == 'ArrowLeft') {
      if (input.selectionStart == 0) {
        let inputs = [this.daysElement, this.hoursElement, this.minutesElement, this.secondsElement]
          .filter(a => !!a);
        let idx = inputs.indexOf(input);
        if (idx > 0) {
          inputs[idx - 1].focus();
        }
      }
    }
    if (e.key == 'ArrowRight') {
      if (input.selectionEnd >= input.value.length) {
        let inputs = [this.daysElement, this.hoursElement, this.minutesElement, this.secondsElement]
          .filter(a => !!a);
        let idx = inputs.indexOf(input);
        if (idx < inputs.length - 1) {
          inputs[idx + 1].focus();
        }
      }
    }
  }

  private getValue(): TimeSpan {
    let days = (this.daysElement?.value || '0').replace(/[^\d]/g, '');
    let hours = (this.hoursElement.value).replace(/[^\d]/g, '');
    let minutes = (this.minutesElement.value).replace(/[^\d]/g, '');
    let seconds = (this.secondsElement?.value || '0').replace(/[^\d]/g, '');
    if (days == '') days = '0';
    if (hours == '') hours = '0';
    if (minutes == '') minutes = '0';
    if (seconds == '') seconds = '0';
    return TimeSpan.fromString(`${days}.${hours}:${minutes}:${seconds}`);
  }

  private getConstraints(i: HTMLInputElement) {
    let result = {
      min: 0,
      max: 59,
      step: 1
    };
    let min = (typeof this.min === 'string' ? TimeSpan.fromString(this.min) : this.min as TimeSpan);
    if (min == null) {
      min = TimeSpan.fromString('00:00');
    }
    let max = (typeof this.max === 'string' ? TimeSpan.fromString(this.max) : this.max as TimeSpan);
    if (max == null) {
      max = TimeSpan.fromString('99.23:59:59');
    }
    let step = (typeof this.step === 'string' ? TimeSpan.fromString(this.step) : this.step as TimeSpan);
    if (step == null) {
      if (this.seconds) {
        step = TimeSpan.fromString('00:00:01');
      } else {
        step = TimeSpan.fromString('00:01');
      }
    }
    let value = this.getValue();
    if (i == this.daysElement) {
      if (step.days > 1) {
        result.step = step.days;
      }
      result.max = max.days;
      result.min = min.days;
    }
    if (i == this.hoursElement) {
      if (step.hours > 1) {
        result.step = step.hours;
      }
      if (this.days && step.days >= 1) {
        result.step = 0;
      }
      if (!this.days) {
        result.max = max.totalHours;
      } else if (value.days == max.days) {
        result.max = max.hours;
      } else {
        result.max = 23;
      }
      if (!this.days) {
        result.min = min.totalHours;
      } else if (value.days == min.days) {
        result.min = min.hours;
      } else {
        result.min = 0;
      }
    }
    if (i == this.minutesElement) {
      if (step.minutes > 1) {
        result.step = step.minutes;
      }
      if (step.totalHours >= 1) {
        result.step = 0;
      }
      if (value.totalHours == max.totalHours) {
        result.max = max.minutes;
      } else {
        result.max = 59;
      }
      if (value.totalHours == min.totalHours) {
        result.min = min.minutes;
      } else {
        result.min = 0;
      }
    }
    if (i == this.secondsElement) {
      if (step.seconds > 1) {
        result.step = step.seconds;
      }
      if (step.totalMinutes >= 1) {
        result.step = 0;
      }
      if (value.totalMinutes == max.totalMinutes) {
        result.max = max.seconds;
      } else {
        result.max = 59;
      }
      if (value.totalMinutes == min.totalMinutes) {
        result.min = min.seconds;
      } else {
        result.min = 0;
      }
    }
    result.max = Math.floor((result.max - result.min) / result.step) * result.step;
    return result;
  }

  private updateSelected() {
    this.popupElement.querySelectorAll('.part .element').forEach(a => a.classList.remove('selected'));
    this.popupElement.querySelector(`.days.part .element-${+this.daysElement?.value}`)?.classList.add('selected');
    this.popupElement.querySelector(`.hours.part .element-${+this.hoursElement.value}`)?.classList.add('selected');
    this.popupElement.querySelector(`.minutes.part .element-${+this.minutesElement.value}`)?.classList.add('selected');
    this.popupElement.querySelector(`.seconds.part .element-${+this.secondsElement?.value}`)?.classList.add('selected');
  }

  private toggle() {
    let rect = this.popupElement.closest('vd-input-time-v2').getBoundingClientRect();
    this.popupElement.style.left = `${rect.x}px`;
    this.popupElement.style.width = `${rect.width - 4}px`;
    this.popupElement.style.top = `${rect.top}px`;

    this.updateSelected();

    this.popupElement.classList.toggle('open');
    (this.popupElement.querySelector(".part") as HTMLElement).focus();
  }

  private popupBlur(e: FocusEvent) {
    if (this.popupElement.contains(e.relatedTarget as Node)) {
      return;
    }
    this.popupElement.classList.toggle('open');
  }

  private select(type: string, value: number) {
    if (type == 'day') {
      this.daysElement.value = ('00' + value).slice(-2);
    }
    if (type == 'hour') {
      this.hoursElement.value = ('00' + value).slice(-2);
    }
    if (type == 'minute') {
      this.minutesElement.value = ('00' + value).slice(-2);
    }
    if (type == 'second') {
      this.secondsElement.value = ('00' + value).slice(-2);
    }
    this.updateSelected();
  }

  private popupKeydown(e: KeyboardEvent) {
    if (['ArrowDown', 'ArrowUp'].indexOf(e.key) == -1) { return; }
    let input = null;
    if ((<HTMLElement>e.target).matches('.days')) {
      input = this.daysElement;
    }
    if ((<HTMLElement>e.target).matches('.hours')) {
      input = this.hoursElement;
    }
    if ((<HTMLElement>e.target).matches('.minutes')) {
      input = this.minutesElement;
    }
    if ((<HTMLElement>e.target).matches('.seconds')) {
      input = this.secondsElement;
    }
    let e2: any = {
      target: input,
      key: e.key == 'ArrowDown' ? 'ArrowUp' : 'ArrowDown'
    };
    this.inputKeyDown(e2);
    this.updateSelected();
  }
}
