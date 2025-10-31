import './vd-draggable.scss';
import { dragDataMimeType, dragIdMimeType, dragStorage, dragTypeMimeType } from 'utility/drag-storage';
import { autoinject, bindable } from 'aurelia-framework';

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
      const id = dragStorage.send({
        item: this.data,
        preview: this.preview || this.data
      });
      e.dataTransfer.setData(dragIdMimeType + id, id);
      e.dataTransfer.setData(dragTypeMimeType + this.type, this.type);
      e.dataTransfer.setData(dragDataMimeType, JSON.stringify(this.data));
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
