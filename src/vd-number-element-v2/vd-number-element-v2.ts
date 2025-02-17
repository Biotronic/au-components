import { bindable, observable } from 'aurelia-framework';
import './vd-number-element-v2.scss'

export class VdNumberElementV2 {
  @bindable
  public value: number;

  @bindable
  public defaultValue: string = '';

  @bindable
  public placeholder: string = '';

  @bindable
  public min: number;

  @bindable
  public max: number;

  @bindable
  public length: number;

  private input: HTMLInputElement;
  @observable
  private text: string;

  constructor() {
    if (!this.value) {
      this.text = this.placeholder;
    }
  }

  private textChanged() {
    if (this.text.match(/^\d+$/)) {
      this.value = +this.text;
    } else {
      this.value = undefined;
    }
  }

  private updateText() {
    if (this.value === undefined) {
      this.text = this.placeholder;
    } else {
      this.text = this.padLeft(this.value);
    }
  }

  private lengthChanged() {
    this.updateText();
  }

  private valueChanged() {
    this.updateText();
  }

  private placeHolderChanged(newValue: string, oldValue: string) {
    if (oldValue == this.text) {
      this.text = newValue;
    }
  }

  private padLeft(s: any): string {
    s = [...Array(this.length)].map(a => '0').join('') + s;
    return s.substring(s.length - this.length);
  }

  private fixInput() {
    let s = this.text.replace(/[^0-9]/g, "");
    if (s == '') {
      s = this.defaultValue;
    } else {
      s = s.replace(/^0+/, '');
      s = s.replace(/^(\d{4}).*/, '$1');
      s = this.padLeft(s);
    }
    this.text = s;
  }

  private inputFocus() {
    this.input.setSelectionRange(0, this.length, 'none');
  }

  private inputKeydown(e: KeyboardEvent) {
    if (e.key == 'Delete' || e.key == 'Backspace') {
      this.text = this.placeholder;
    }
    return true;
  }

  private inputKeyup(e: KeyboardEvent) {

    let delta = 0;
    if (e.key == 'ArrowUp') {
      delta = 1;
    }
    if (e.key == 'ArrowDown') {
      delta = -1;
    }
    if (delta != 0) {
      let s = this.text || '';
      if (s == this.placeholder) {
        s = this.defaultValue;
      } else {
        let n = +s + delta;
        if (!isNaN(this.min - this.max)) {
          n = (n - this.min + (this.max - this.min + 1)) % (this.max - this.min + 1) + this.min;
        }
        s = this.padLeft(n);
      }
      this.text = s;
      return;
    }

    if (e.key == 'ArrowLeft' && this.input.selectionStart == 0) {
      delta = -1;
    }
    if (e.key == 'ArrowRight' && this.input.selectionEnd >= (this.text || '').length) {
      delta = 1;
    }

    if (delta != 0) {
      let inputs: HTMLElement[] = Array.from(this.input.parentElement.parentElement.querySelectorAll('vd-number-element-v2 input'));
      let i = inputs.indexOf(this.input) + delta;

      if (i >= 0 && i < inputs.length) {
        inputs[i].focus();
      }
    }
  }
}
