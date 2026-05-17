import { bindable, bindingMode } from 'aurelia-framework';
import './vd-popup-v2.scss';

export class VdPopupV2 {
  @bindable({ defaultBindingMode: bindingMode.twoWay })
  public visible = false;
  @bindable
  private anchor = 'below center';
  @bindable
  private relativeTo: HTMLElement;
  private element: HTMLElement;
  private popupElement: HTMLElement;
  private popupRect: DOMRect = new DOMRect();
  private clickHandler: (e: MouseEvent) => void;
  private blurHandler: (e: FocusEvent) => void;

  constructor() {
    this.clickHandler = this.handleClickOut.bind(this);
    this.blurHandler = this.handleClickOut.bind(this);
  }

  public attached() {
    document.body.appendChild(this.popupElement);

    window.addEventListener('resize', () => {
      if (this.visible) {
        this.positionPopup();
      }
    });
    document.addEventListener('mousedown', this.clickHandler);
    window.addEventListener('blur', this.blurHandler);
  }

  public detached() {
    this.element.appendChild(this.popupElement);
  }

  private get verticalAnchor() {
    return this.anchor.match(/\b(above|below)\b/)?.[0] || 'center';
  }

  private get horizontalAnchor() {
    return this.anchor.match(/\b(left|right)\b/)?.[0] || 'center';
  }

  private visibleChanged(visible: boolean) {
    if (!this.popupElement) {
      return;
    }
    if (!visible) {
      this.popupElement.style.visibility = 'hidden';
      this.popupElement.style.pointerEvents = 'none';
      return;
    }
    this.popupElement.style.visibility = 'visible';
    this.popupElement.style.pointerEvents = 'auto';
    this.popupRect = this.popupElement.getBoundingClientRect();

    this.positionPopup();

    this.relativeTo.addEventListener('focusout', this.blurHandler);
  }

  private positionPopup() {
    const rect = this.relativeTo.getBoundingClientRect();

    const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max);

    let top = this.verticalAnchor === 'above' ? rect.top - this.popupRect.height :
      this.verticalAnchor === 'below' ? rect.bottom :
        rect.top + (rect.height - this.popupRect.height) / 2;

    let left = this.horizontalAnchor === 'left' ? rect.left :
      this.horizontalAnchor === 'right' ? rect.right - this.popupRect.width :
        rect.left + (rect.width - this.popupRect.width) / 2;

    top = clamp(top, 0, window.innerHeight - this.popupRect.height);
    left = clamp(left, 0, window.innerWidth - this.popupRect.width);

    this.popupElement.style.top = `${top}px`;
    this.popupElement.style.left = `${left}px`;
  }

  private toggle(state?: boolean) {
    if (state !== undefined) {
      this.visible = state;
    } else {
      this.visible = !this.visible;
    }
  }

  private handleClickOut(e: MouseEvent | FocusEvent) {
    const target = e.relatedTarget as Node || e.target as Node;

    if (e.target != window) {
      if (this.popupElement.contains(target)) {
        return;
      }
      if (this.relativeTo.contains(target)) {
        return;
      }
    }

    this.toggle(false);
    this.relativeTo.removeEventListener('focusout', this.blurHandler);
  }
}
