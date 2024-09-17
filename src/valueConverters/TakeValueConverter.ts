export class TakeValueConverter {
  public toView(value: any[], count: number) {
    return value.slice(0, count);
  }
}
