export class SkipValueConverter {
  public toView(value: any[], count: number) {
    return value.slice(count, value.length);
  }
}
