import './vd-drop-target.scss';
import { autoinject, bindable } from 'aurelia-framework';

interface IDropEvent {
  data: any;
  preview: any;
  type: string;
  x: number;
  y: number;
}

@autoinject
export class VdDropTarget {
  @bindable
  public accept: string | string[] = [];
  @bindable
  public dropEffect: 'copy' | 'move' | 'link' = 'move';
  @bindable
  public active = true;
  @bindable
  public testFunc: (event: IDropEvent) => boolean;
  @bindable
  public dropFunc: (event: IDropEvent) => void;
  @bindable
  public dropCancelFunc: (event: IDropEvent) => void;

  private dropTargetElement: HTMLElement;

  private isTypeAccepted(type: string): boolean {
    if (type.startsWith('linx/type-')) {
      type = type.substring('linx/type-'.length);
    }

    let accept: string[] = [];
    if (typeof this.accept === 'string') {
      accept = this.accept.split(',').map(t => t.trim());
    } else {
      accept = this.accept;
    }
    return accept.includes(type);
  }

  attached() {
    const test = (e: DragEvent) => {
      return e.dataTransfer.types.some(t => this.isTypeAccepted(t));
    }
    const createEvent = (e: DragEvent): IDropEvent => {
      const type = e.dataTransfer.types.find(t => t.startsWith('linx/type-'));
      const data = JSON.parse(e.dataTransfer?.getData('linx/data') || 'null');
      const preview = JSON.parse(decodeURIComponent(e.dataTransfer.types.find(t => t.startsWith('linx/preview-')).substring('linx/preview-'.length)));
      const rect = this.dropTargetElement.getBoundingClientRect();
      return {
        data: data,
        preview: preview,
        type: type ? type.substring('linx/type-'.length) : '',
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
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
      if (this.dropCancelFunc) {
        this.dropCancelFunc(createEvent(e));
      }
    });
    this.dropTargetElement.addEventListener('dragover', (e: DragEvent) => {
      if (!test(e)) {
        return;
      }
      if (this.testFunc) {
        if (this.testFunc(createEvent(e)) === false) {
          this.dropTargetElement.classList.add('drag-refuse');
          return;
        }
      }
      e.preventDefault();
      e.dataTransfer.dropEffect = this.dropEffect;
    });
    this.dropTargetElement.addEventListener('drop', (e: DragEvent) => {
      this.dropTargetElement.classList.remove('drag-over');
      this.dropTargetElement.classList.remove('drag-refuse');
      if (!test(e)) {
        return;
      }
      e.preventDefault();
      const data = JSON.parse(e.dataTransfer?.getData('linx/data'));
      if (this.dropFunc) {
        this.dropFunc(createEvent(e));
      }
    });
  }
}
