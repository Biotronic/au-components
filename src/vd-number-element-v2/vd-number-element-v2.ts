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
  public step: number;

  @bindable
  public length: number;

  private input: HTMLInputElement;
  @observable
  private text: string;

  private inputCount: number = 0;

  constructor() {
    if (!this.value) {
      this.text = this.placeholder;
    }
  }

  private textChanged() {
    if ((''+this.text).match(/^\d+$/)) {
      this.value = +this.padLeft(this.text);
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
    s = s.substring(s.length - this.length);
    return s;
  }

  private fixInput() {
    if (this.justCleared) {
      this.text = this.placeholder;
      setTimeout(() => this.justCleared = false, 0);
      return;
    }
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

  private inputBlur() {
    let v = this.text;
    if (v.match(/^\d+$/) && this.step) {
      v = '' + (Math.round((+v - (this.min || 0)) / +this.step) * +this.step + (this.min || 0));
    }
    if (+v < this.min) {
      v = '' + this.min;
    }
    if (+v > this.max) {
      v = '' + this.max;
    }
    if (v != this.text) {
      this.text = this.padLeft(v);
    }
    this.inputCount = 0;
  }

  private justCleared: boolean = false;
  private inputKeydown(e: KeyboardEvent) {
    if (e.key == 'Delete' || e.key == 'Backspace') {
      this.text = this.placeholder;
      this.value = undefined;
      this.inputCount = 0;
      this.justCleared = true;
    }
    return true;
  }

  private moveFocus(delta: number) {
    if (delta == 0) { return; }
    if (this.stepped) { return; }

    let inputs: HTMLElement[] = Array.from(this.input.parentElement.parentElement.querySelectorAll('vd-number-element-v2 input'));
    let i = inputs.indexOf(this.input) + delta;

    if (i >= 0 && i < inputs.length) {
      inputs[i].focus();
    }
  }

  private doStep(delta: number) {
    if (delta == 0) { return; }

    let s = this.text || '';
    if (s == this.placeholder) {
      s = this.defaultValue;
    } else {
      let n = +s + delta;
      if (!isNaN(this.min - this.max)) {
        if (n > this.max) {
          n = this.min;
        }
        if (n < this.min) {
          n = this.max;
        }
      }
      s = this.padLeft(n);
    }
    this.text = s;
  }

  private stepped: boolean = false;
  private inputKeyup(e: KeyboardEvent) {
    if (this.justCleared) {
      this.text = this.placeholder;
      setTimeout(() => this.justCleared = false, 0);
      return;
    }
    let delta = 0;
    if (e.key == 'ArrowUp') {
      delta = this.step || 1;
      this.stepped = true;
      setTimeout(() => {
        this.stepped = false;
      }, 0);
    }
    if (e.key == 'ArrowDown') {
      delta = -(this.step || 1);
      this.stepped = true;
      setTimeout(() => {
        this.stepped = false;
      }, 0);
    }
    this.doStep(delta);

    if (e.key == 'ArrowLeft' && this.input.selectionStart == 0) {
      delta = -1;
    }
    if (e.key == 'ArrowRight' && this.input.selectionEnd >= (this.text || '').length) {
      delta = 1;
    }

    if (e.key.match(/^\d$/)) {
      this.inputCount++;
    }

    if (this.inputCount == this.length) {
      this.moveFocus(1);
    }
    this.moveFocus(delta);
  }
}
