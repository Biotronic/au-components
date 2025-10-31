import { autoinject, bindable } from 'aurelia-framework';
import './vd-draggable.scss';

@autoinject
export class VdDraggable {
  @bindable
  public type: string;
  @bindable
  public data: any;
  @bindable
  public preview?: any;
  private draggableElement: HTMLElement;

  attached() {
    this.draggableElement.draggable = true;
    this.draggableElement.addEventListener('dragstart', (e: DragEvent) => {
      e.dataTransfer?.setData(`linx/type`, this.type);
      e.dataTransfer?.setData(`linx/type-${this.type}`, 'type');
      e.dataTransfer?.setData(`linx/preview-${encodeURIComponent(JSON.stringify(this.preview || this.data))}`, 'dummy');
      e.dataTransfer?.setData('linx/data', JSON.stringify(this.data));
      this.draggableElement.classList.add('dragging');
    });
    this.draggableElement.addEventListener('dragend', (e: DragEvent) => {
      this.draggableElement.classList.remove('dragging');
    });
  }
}
