import { bindable } from 'aurelia-framework';
import './vd-popup-v2.scss';

export class VdPopupV2 {
  @bindable
  public visibility: 'hidden' | 'visible' = 'hidden';
  private element: HTMLElement;
  private ancestor: HTMLElement;
  private handler;

  constructor() {
    this.handler = this.handleFocusOut.bind(this);
  }

  private visibilityChanged(value) {
    if (value == 'visible') {
      var focusableAncestor: HTMLElement = this.element.closest('a[href], button, input, select, textarea, details, iframe, [tabindex]:not([tabindex="-1"])');
      console.log(focusableAncestor);
      if (focusableAncestor) {
        this.ancestor = focusableAncestor;
        this.ancestor.addEventListener('focusout', this.handler);
      }
    }
  }

  public show() {
    this.visibility = 'visible';
  }

  public hide() {
    this.visibility = 'hidden';
  }

  private toggle() {
    if (this.visibility == 'hidden') {
      this.show();
    } else {
      this.hide();
    }
  }

  private handleFocusOut() {
    setTimeout(() => {
      console.log('Hi!');
      if (!this.ancestor?.matches(':focus-within')) {
        this.hide();
        this.ancestor?.removeEventListener('focusout', this.handler);
        this.ancestor = null;
      }
    }, 0);
  }
}
