import './vd-draggable.scss';
import { dragIdMimeType, dragStorage, dragTypeMimeType } from 'utility/drag-storage';
import { autoinject, bindable } from 'aurelia-framework';

@autoinject
export class VdDraggable {
  @bindable
  public type: string;
  @bindable
  public data: any;
  
  private draggableElement: HTMLElement;

  attached() {
    this.draggableElement.draggable = true;
    this.draggableElement.addEventListener('dragstart', (e: DragEvent) => {
      const id = dragStorage.send(this.data);
      e.dataTransfer.setData(dragIdMimeType + id, id);
      e.dataTransfer.setData(dragTypeMimeType + this.type, this.type);
      this.draggableElement.classList.add('dragging');
    });
    this.draggableElement.addEventListener('dragend', (e: DragEvent) => {
      this.draggableElement.classList.remove('dragging');
      const id = e.dataTransfer.types.find(t => t.startsWith(dragIdMimeType)).substring(dragIdMimeType.length);
      setTimeout(() => {
        dragStorage.unsend(id);
      }, 10000);
    });
  }
}
