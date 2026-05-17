export class Home {
  public validate(text: string): 'ok' | 'invalid' | 'revert' {
    let re = /^(?<year>\d{4})-(?<month>\d\d)-(?<date>\d\d)$/;
    let m = text.match(re);
    if (!m) {
      return 'revert';
    }
    if (+m.groups['year'] < 2000) {
      return 'invalid';
    }
    return 'ok';
  }

  public value: string = '1995-01-01';
}
