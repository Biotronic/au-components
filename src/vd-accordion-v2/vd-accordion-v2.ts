import './vd-accordion-v2.scss'

export class VdAccordionV2 {
  private element: HTMLElement;
  private slot: number = 0;
  private rows: string;

  constructor() {
    document.addEventListener('keydown', e => {
      if (e.key == 'ArrowUp') {
        this.previous();
      }
      if (e.key == 'ArrowDown') {
        this.next();
      }
    });
  }

  attached() {
    this.move(0);
  }

  public next() {
    this.move(+1);
  }

  public previous() {
    this.move(-1);
  }

  public move(delta: number) {
    let max = this.element.childElementCount - 1;
    let newSlot = this.slot + delta;
    if (newSlot < 0) { newSlot = 0; }
    if (newSlot > max) { newSlot = max; }

    (this.element.children[this.slot] as HTMLElement).classList.remove('active-section');
    this.slot = newSlot;
    this.rows = [...Array(max+1)].map((a,i) => i == newSlot ? '100%' : '0').join(' ');
    (this.element.children[this.slot] as HTMLElement).classList.add('active-section');
    console.warn(this.rows);
  }
}
