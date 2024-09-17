export class SortState {

  public sort: string = '';
  public sortDir: string = 'asc';

  constructor(sort?: string, sortDir?: string) {
      if (sort) {
          this.sort = sort;
      }

      if (sortDir) {
          this.sortDir = sortDir;
      }
  }

  public toggleSortDirection() {
      if (this.sortDir === 'asc') {
          this.sortDir = 'desc';
      } else {
          this.sortDir = 'asc';
      }
  }

  public sortBy(sort: string) {
      if (this.sort === sort) {
          if (this.sortDir === 'desc') {
              this.sortDir = 'asc';
          } else {
              this.sortDir = 'desc';
          }
      } else {
          this.sort = sort;
          this.sortDir = 'asc';
      }
  }
}
