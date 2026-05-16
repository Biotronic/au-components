import './vd-drop-target.scss';
import { dragIdMimeType, dragStorage, dragTypeMimeType } from '../utility/drag-storage';
import { autoinject, bindable } from 'aurelia-framework';

export interface IDropEvent {
  data: any;
  type: string;
  // x, y coordinates relative to dropTargetElement.
  x: number;
  y: number;
  // The original drag event.
  event: DragEvent;
}

@autoinject
export class VdDropTarget {
  // Which types of object that can be dropped on this drop target.
  // This matches the type field on vd-draggable.
  @bindable
  public accept: string | string[] = ['unspecified'];
  // Basically just what cursor to show - will also be filtered against dropEffectsAllowed on vd-draggable.
  // You probably don't need to touch this.
  @bindable
  public dropEffect: 'copy' | 'move' | 'link' = 'move';
  // Whether the drop target will accept drops right now.
  @bindable
  public active = true;
  // Called repeatedly while dragging.
  // Useful for updating previews, e.g.
  // Return false to indicate that this is not the right spot (not enough space, e.g.)
  @bindable
  public dragFunc: (arg: { event: IDropEvent }) => boolean;
  // Called when the dragged object leaves.
  // Useful for cleaning up previews, e.g.
  @bindable
  public dragLeaveFunc: (arg: { event: IDropEvent }) => void;
  // Called when the drag operation ends with it being dropped here.
  // You should probably bind this and handle the result.
  @bindable
  public dropFunc: (arg: { event: IDropEvent }) => void;

  private dropTargetElement: HTMLElement;

  attached() {
    const findWithPrefix = (arr: Readonly<string[]>, prefix: string) => arr.find(e => e.startsWith(prefix)).substring(prefix.length);

    const test = (e: DragEvent) => {
      let type = findWithPrefix(e.dataTransfer.types, dragTypeMimeType);
      let accept = typeof (this.accept) == 'string' ? [...this.accept.split(',')] : this.accept;
      return this.active && accept.includes(type);
    }

    const createEvent = (e: DragEvent): IDropEvent => {
      const type = findWithPrefix(e.dataTransfer.types, dragTypeMimeType);
      const id = findWithPrefix(e.dataTransfer.types, dragIdMimeType);
      const msg = dragStorage.get(id);
      const rect = this.dropTargetElement.getBoundingClientRect();
      return {
        data: msg,
        type: type,
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        event: e
      };
    }

    this.dropTargetElement.addEventListener('dragenter', (e: DragEvent) => {
      if (!test(e)) {
        return;
      }
      this.dropTargetElement.classList.add('drag-over');
    });

    this.dropTargetElement.addEventListener('dragleave', (e: DragEvent) => {
      this.dropTargetElement.classList.remove('drag-over');
      this.dropTargetElement.classList.remove('drag-refuse');
      if (this.dragLeaveFunc) {
        this.dragLeaveFunc({ event: createEvent(e) });
      }
    });

    this.dropTargetElement.addEventListener('dragover', (e: DragEvent) => {
      if (!test(e)) {
        return;
      }
      e.dataTransfer.dropEffect = this.dropEffect;
      if (this.dragFunc) {
        if (this.dragFunc({ event: createEvent(e) }) === false) {
          this.dropTargetElement.classList.add('drag-refuse');
          return;
        }
      }
      e.preventDefault();
    });

    this.dropTargetElement.addEventListener('drop', (e: DragEvent) => {
      this.dropTargetElement.classList.remove('drag-over');
      this.dropTargetElement.classList.remove('drag-refuse');
      const id = findWithPrefix(e.dataTransfer.types, dragIdMimeType);
      if (!test(e)) {
        dragStorage.unsend(id);
        return;
      }
      e.preventDefault();
      if (this.dropFunc) {
        this.dropFunc({ event: createEvent(e) });
      }
      dragStorage.unsend(id);
    });
  }
}
