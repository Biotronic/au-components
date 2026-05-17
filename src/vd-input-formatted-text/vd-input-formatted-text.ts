import { bindable, observable } from 'aurelia-framework';
import { autoinject } from 'aurelia-dependency-injection';
import './vd-input-formatted-text.scss'

interface ISelection {
  start: number;
  end: number;
  length: number;
  direction: 'forward' | 'backward' | 'none';
  text: string,
  formatText: string;
}

@autoinject
export class VdInputFormattedText {

  @bindable
  // # for replaceable characters - everything else is fixed
  public format: string = '';

  @bindable
  public value: string;

  @bindable
  public validate: (text: string) => 'ok' | 'invalid' | 'revert' = () => 'ok';

  @bindable({ defaultBindingMode: 'two-way' })
  public valid: boolean = true;
  private get validClass() { return this.valid ? '' : 'invalid'; };

  private inputElement: HTMLInputElement;

  public bind(params: object, ctx: { bindingContext: { value: string } }) {
    this.actualValue = ctx.bindingContext.value;
  }

  private valueChanged(newValue: string) {
    if (!this.testText(newValue)) {
      return;
    }
    let v = !this.validate ? 'ok' : this.validate(newValue);
    if (v == 'revert') {
      return;
    }
    this.actualValue = newValue;
    this.updateValue();
  }

  private testText(text: string) {
    let format = this.format;
    // Escape regex symbols
    format = format.replace(/[\\\$\.\?\*\^\|\+\(\)\{\}\[\]]/g, '\\$1');
    // Replace wildcards
    format = format.replace(/#/g, '.');
    let re = new RegExp(`^${format}$`);
    return re.test(text);
  }

  public actualValue: string = '';
  private storedValue: string = '';
  private resetValue() {
    if (!this.storedValue) {
      return;
    }
    let sel = Object.assign({}, this.storedSelection);
    this.actualValue = this.storedValue;
    setTimeout(() => {
      this.resetSelection(sel);
    }, 0);
  }
  private updateValue() {
    if (this.actualValue == this.storedValue) {
      return;
    }
    if (!this.testText(this.actualValue)) {
      this.resetValue();
    } else {
      let v = !this.validate ? 'ok' : this.validate(this.actualValue);
      switch (v) {
        case 'revert':
          this.resetValue();
          this.valid = false;
          return;
        case 'invalid':
          this.valid = false;
          break;
        case 'ok':
        default:
          this.valid = true;
          this.value = this.actualValue;
          break;
      }
      this.storedValue = this.actualValue;
    }
  }
  public input(e: InputEvent) {
    this.updateValue();
  }

  private getSelection(start: number | null = null, end: number | null = null, direction: 'forward' | 'backward' | 'none' | null = null): ISelection {
    start = start !== null ? start : this.inputElement.selectionStart;
    end = end !== null ? end : this.inputElement.selectionEnd;
    direction = direction !== null ? direction : this.inputElement.selectionDirection;
    if (start !== null && start < 0) {
      start = 0;
    }
    let result: ISelection = {
      start: start || 0,
      end: end || 0,
      length: 0,
      direction: direction || 'none',
      text: '',
      formatText: ''
    };
    if (end !== null && start !== null) {
      result.text = this.inputElement.value.substring(start, end);
      result.formatText = this.format.substring(start, end);
      result.length = end - start;
    }
    return result;
  }

  private storedSelection: ISelection = {
    start: 0,
    end: 0,
    length: 0,
    direction: 'none',
    text: '',
    formatText: ''
  };

  private resetSelection(sel: ISelection | null = null) {
    sel ||= this.storedSelection;
    this.inputElement.setSelectionRange(sel.start, sel.end, sel.direction);
  }

  private fixSelection(sel: ISelection, delta: number): ISelection | null {
    if (sel.start == 0 && sel.end == this.actualValue.length) {
      // Everything selected - expand to whole block
      sel = this.storedSelection;
      while (sel.start > 0 && this.format[sel.start - 1] == '#') {
        --sel.start;
      }
      while (sel.end < this.format.length && this.format[sel.end] == '#') {
        ++sel.end;
      }
      if (sel.end < sel.start) {
        sel.end = sel.start + 1;
      }
      sel.length = sel.end - sel.start;
      this.resetSelection();
      return null;
    }
    if (sel.formatText.match(/[^#]/)) {
      this.resetSelection();
      return null;
    }
    if (sel.length != 0) {
      this.storedSelection = sel;
      return sel;
    }
    sel.start ||= 0;
    while (this.format[sel.start] != '#') {
      sel.start += delta;
      if (sel.start >= this.actualValue.length || sel.start < 0) {
        if (this.format.endsWith('#')) {
          // Select last character
          this.storedSelection.start = this.format.length - 1;
          this.storedSelection.end = this.format.length;
        }
        this.resetSelection();
        return null;
      }
    }
    sel.end = sel.start + 1;
    this.storedSelection = sel;
    this.resetSelection();
    return null;
  }

  public selectionchange(e: Event) {
    this.updateValue();
    this.fixSelection(this.getSelection(), 1);
  }

  public keydown(e: KeyboardEvent) {
    switch (e.key) {
      case 'ArrowLeft': {
        let sel = this.getSelection();
        if ((e.shiftKey || e.ctrlKey) && sel.length > 1 && sel.direction == 'forward') {
          return true;
        } else if (e.shiftKey) {
          sel = this.getSelection((sel.start || 0) - 1, null, 'backward');
        } else if (e.ctrlKey) {
          // Scan backward to find previous group
          sel = this.getSelection((sel.start || 0), null, 'backward');
          let s = this.format.split('').reverse().join('');
          s = s.replace(/[^#]/g, '-');
          let idx = s.indexOf('-', s.length - sel.start);
          if (idx != -1) {
            idx = s.indexOf('#', idx);
          }
          if (idx == -1) {
            sel.start = 0;
            sel.end = 1;
          } else {
            sel.start = this.format.length - idx - 1;
            sel.end = sel.start + 1;
          }
        } else {
          sel = this.getSelection((sel.start || 0) - 1, (sel.start || 0) - 1);
        }
        if (this.fixSelection(sel, -1)) {
          this.resetSelection();
        }
        return false;
      }
      default:
        return true;
    }
  }
}
