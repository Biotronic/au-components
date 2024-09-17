import './bc-paging.scss'
import { bindable, bindingMode } from 'aurelia-framework';
import { SortState } from 'valueConverters/SortState';
import { SortValueConverter } from 'valueConverters/SortValueConverter';

export class BcPaging {
  @bindable({ callback: 'updatePage' })
  public data: any[];

  @bindable({ callback: 'updatePage' })
  public sort: SortState = new SortState();

  @bindable({ callback: 'updatePage', defaultBindingMode: bindingMode.twoWay })
  public page: number = 0;

  @bindable({ callback: 'updatePage', defaultBindingMode: bindingMode.twoWay })
  public size: number = 10;

  @bindable({  })
  public first: number;

  @bindable({  })
  public last: number;

  public maxPage: number;

  public pageRows: any[];

  public dataChanged() {
    this.updatePage();
  }

  public pageChanged() {
    this.updatePage();
  }

  public updatePage() {
    this.maxPage = Math.max(0, Math.ceil(this.data.length / this.size)-1);
    this.first = this.page * this.size;
    this.last = Math.min(this.first + this.size, this.data.length)-1;

    let svc = new SortValueConverter();
    
    this.pageRows = svc.toView(this.data, this.sort.sort, this.sort.sortDir).slice(this.first, this.last+1);

    

    console.log(this);
  }
}
