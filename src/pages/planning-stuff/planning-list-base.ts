import { bindable } from "aurelia-templating";
import { PlanningStuff } from "./planning-stuff";

export class PlanningListBase<T> {
  @bindable
  public planning: PlanningStuff;
  @bindable
  public openable = true;
  private listElement: HTMLElement;
  @bindable
  private items: T[];
  public dragType: string;
  public acceptDrag: string[] = [];

  dragstart(e: DragEvent, item: T) {
    const target = e.target as HTMLElement;
    target.classList.add('dragging');

    e.dataTransfer.setData(`application/data-${this.dragType}`, this.dragType);
    e.dataTransfer.setData(`application/data-index`, this.items.indexOf(item).toString());
    e.dataTransfer.setData('application/json', JSON.stringify(item));

    const size = 260;
    const rect = target.getBoundingClientRect();
    const scale = size / Math.max(rect.width, rect.height, size);
    const ghost = document.createElement('drag-ghost');
    ghost.style.setProperty('--drag-scale', `${scale}`);
    ghost.style.setProperty('--drag-width', `${rect.width}px`);
    ghost.style.setProperty('--drag-height', `${rect.height}px`);
    ghost.appendChild(target.cloneNode(true));
    this.listElement.appendChild(ghost);

    e.dataTransfer.setDragImage(ghost, e.offsetX * scale, e.offsetY * scale);
    requestAnimationFrame(() => ghost.remove());
    return true;
  }

  attached() {
    this.listElement?.addEventListener('dragend', (e: DragEvent) => {
      (e.target as HTMLElement).classList.remove('dragging');
    }, { capture: true });

    this.listElement?.addEventListener('dragover', (e: DragEvent) => {
      if (this.acceptDrag.some(t => e.dataTransfer.types.includes(`application/data-${t}`))) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
      } else {
        e.dataTransfer.dropEffect = 'none';
      }
    });
    this.listElement?.addEventListener('drop', (e: DragEvent) => {
      //const data = JSON.parse(e.dataTransfer.getData('application/json'));
      const type = this.acceptDrag.filter(t => e.dataTransfer.types.includes(`application/data-${t}`))[0];
      const index = parseInt(e.dataTransfer.getData('application/data-index'));
      const data = this.planning.getItem(type, index);

      const obj = {
        data: data,
        target: e.target as HTMLElement,
        type: type,
        x: e.clientX,
        y: e.clientY
      };

      this.onDropped(obj);
      e.preventDefault();
    });
  }

  public onDropped(event: { data: any; target: HTMLElement; type: string; x: number; y: number; }) {
    console.log('Dropped data:', event);
  }
}
