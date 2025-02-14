import './vd-single-carousel-v2.scss'

export class VdSingleCarouselV2 {
  private slot: number = 1;
  private action: string = '';

  public next() {
    this.move(+1);
  }

  public previous() {
    this.move(-1);
  }

  public move(delta: number) {
    this.action = 'moving';
    this.slot = delta > 0 ? 1 : 2;
    setTimeout(() => {
      this.action = '';
      this.slot = delta > 0 ? 2 : 1;
    }, 10);
  }
}
