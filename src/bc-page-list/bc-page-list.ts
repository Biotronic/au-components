import './bc-page-list.scss'
import { bindable } from 'aurelia-framework';

export class BcPageList {
  @bindable
  public page: number;

  @bindable
  public maxPage: number = 1;

  @bindable
  public range: number = 5;

  public pages: number[];

  public maxPageChanged() {
    this.pageChanged();
  }

  public rangeChanged() {
    this.pageChanged();
  }

  public pageChanged() {
    if (this.page > this.maxPage) {
      this.page = this.maxPage;
    }
    if (this.page < 0) {
      this.page = 0;
    }

    let min = Math.max(0, this.page - this.range);
    let max = Math.min(this.maxPage, this.page + this.range)+1;
    if (min > max || isNaN(min + max)) {
      this.pages = [0];
    } else {
      this.pages = Array.from(Array(max - min)).map((a, i) => i + min);
    }
  }

  private setPage(index: number) {
    if (index > this.maxPage) {
      this.page = this.maxPage;
    } else if (index < 0) {
      this.page = 0;
    } else {
      this.page = index;
    }
  }
}
