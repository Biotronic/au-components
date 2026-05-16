import './vd-draggable.scss';
import { dragIdMimeType, dragStorage, dragTypeMimeType } from '../utility/drag-storage';
import { autoinject, bindable } from 'aurelia-framework';

@autoinject
export class VdDraggable {
  // The type of object being dragged.
  // Used for filtering in vd-drop-target.
  @bindable
  public type: string = 'unspecified';
  // The actual object being dragged. Duh.
  @bindable
  public data: any;
  // Whether this thing can be dragged right now.
  @bindable
  public active: boolean = true;
  @bindable
  public dropEffectsAllowed: ('copy' | 'link' | 'move')[] = ['copy', 'link', 'move'];

  private draggableElement: HTMLElement;

  attached() {
    const findWithPrefix = (arr: Readonly<string[]>, prefix: string) => arr.find(e => e.startsWith(prefix)).substring(prefix.length);

    const getEffects = () => {
      let effects: 'none' | 'copy' | 'copyLink' | 'copyMove' | 'link' | 'linkMove' | 'move' | 'all' | 'uninitialized' =
        ['copy', 'link', 'move']
          .filter((a: any) => this.dropEffectsAllowed.includes(a))
          .map((a, i) => i == 0 ? a : (a[0].toUpperCase() + a.substring(1)))
          .join('') as any;
      switch (effects as any) {
        case '': effects = 'none'; break;
        case 'copyLinkMove': effects = 'all'; break;
      }
      return effects;
    }

    this.draggableElement.addEventListener('dragstart', (e: DragEvent) => {
      const id = dragStorage.send(this.data);
      e.dataTransfer.setData(dragIdMimeType + id, id);
      e.dataTransfer.setData(dragTypeMimeType + this.type, this.type);

      e.dataTransfer.effectAllowed = getEffects();
      this.draggableElement.classList.add('dragging');
    });

    this.draggableElement.addEventListener('dragend', (e: DragEvent) => {
      this.draggableElement.classList.remove('dragging');
      const id = findWithPrefix(e.dataTransfer.types, dragIdMimeType);
      setTimeout(() => {
        dragStorage.unsend(id);
      }, 10000);
    });
  }
}
