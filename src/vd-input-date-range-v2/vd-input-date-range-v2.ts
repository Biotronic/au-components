import { bindable, bindingMode } from 'aurelia-framework';
import './vd-input-date-range-v2.scss'

export class VdInputDateRangeV2 {
  @bindable
  public separator: string = '/';
  @bindable
  public min: Date | string | null;
  @bindable
  public max: Date | string | null;

  @bindable({ mode: bindingMode.twoWay })
  public value: Date;

  private popupElement: HTMLDivElement;
  private valueUpdating: boolean = false;
  private isAttached: boolean = false;

  private fromDateDate: string = 'dd';
  private fromDateMonth: string = 'MM';
  private fromDateYear: string = 'yyyy';
  private toDateDate: string = 'dd';
  private toDateMonth: string = 'MM';
  private toDateYear: string = 'yyyy';

  private element: HTMLElement;
  private fromDateDateElement: HTMLInputElement;
  private fromDateMonthElement: HTMLInputElement;
  private fromDateYearElement: HTMLInputElement;
  private toDateDateElement: HTMLInputElement;
  private toDateMonthElement: HTMLInputElement;
  private toDateYearElement: HTMLInputElement;

  private get minValue(): Date {
    return (typeof this.min === 'string' ? new Date(this.min) : this.min as Date) || new Date('0001-01-01');
  }
  private get maxValue(): Date {
    return (typeof this.max === 'string' ? new Date(this.min) : this.max as Date) || new Date('3000-01-01');
  }

  private get allInputs(): HTMLInputElement[] {
    return Array.from(this.element.querySelectorAll('&.input>input'));
    //return [this.fromDateDateElement, this.fromDateMonthElement, this.fromDateYearElement, this.toDateDateElement, this.toDateMonthElement, this.toDateYearElement];
  }
  private getConstraints(i: HTMLInputElement): { min: number, max: number } {
    return { min: 1, max: 31 };
  }

  valueChanged(newValue) {
  }

  attached() {
    this.isAttached = true;
    for (let input of this.allInputs) {
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
    input.setSelectionRange(0, input.maxLength, 'none');
  }

  private inputBlur(e: FocusEvent) {
    this.cleanup(e.target as HTMLInputElement);
  }

  private cleanup(input: HTMLInputElement, delta?: number) {
  }

  private inputKeyDown(e: KeyboardEvent) {
    let input = e.target as HTMLInputElement;
    let constraints = this.getConstraints(input);
    if (e.key == 'ArrowUp') {
      this.cleanup(input, 1);
    }
    if (e.key == 'ArrowDown') {
      this.cleanup(input, -1);
    }
    if (e.key == 'ArrowLeft') {
      if (input.selectionStart == 0) {
        let idx = this.allInputs.indexOf(input);
        if (idx > 0) {
          this.allInputs[idx - 1].focus();
        }
      }
    }
    if (e.key == 'ArrowRight') {
      if (input.selectionEnd >= input.value.length) {
        let idx = this.allInputs.indexOf(input);
        if (idx < this.allInputs.length - 1) {
          this.allInputs[idx + 1].focus();
        }
      }
    }
  }

  private inputChange(e: Event) {
    let input = e.target as HTMLInputElement;

    input.value = input.value.replace(/[^\d]/g, '');

    if (input.selectionEnd >= 2) {
      let idx = this.allInputs.indexOf(input);
      if (idx < this.allInputs.length - 1) {
        this.allInputs[idx + 1].focus();
      }
    }
  }

  private toggle() {
    let rect = this.popupElement.closest('vd-input-date-range-v2').getBoundingClientRect();
    this.popupElement.style.left = `${rect.x}px`;
    this.popupElement.style.width = `${rect.width - 4}px`;
    this.popupElement.style.top = `${rect.bottom}px`;

    this.popupElement.classList.toggle('open');
  }

  private popupBlur(e: FocusEvent) {
    if (this.popupElement.contains(e.relatedTarget as Node)) {
      return;
    }
    this.popupElement.classList.toggle('open');
  }

  private popupKeydown(e: KeyboardEvent) {
  }
}
