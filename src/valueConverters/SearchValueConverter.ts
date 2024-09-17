export class DeepSearchValueConverter {
  public toView(value: any[], searchText: string) {
    if (!searchText) {
      return value;
    }
    let parts = searchText.toLowerCase().split(/\s+/);
    return value.filter(a => this.test(a, parts, 4).length == 0)
  }

  private test(obj: any, parts: string[], maxDepth: number): string[] {
    if (maxDepth <= 0) {
      return parts;
    }
    for (let x in obj) {
      if (obj[x] === null || obj[x] === undefined) {
        continue;
      }
      if (typeof (obj[x]) == 'object') {
        parts = this.test(obj[x], parts, maxDepth - 1);
      } else {
        let s = String(obj[x]).toLowerCase();
        parts = parts.filter(p => s.indexOf(p) == -1);
      }
      if (parts.length == 0) {
        return parts;
      }
    }
    return parts;
  }
}
