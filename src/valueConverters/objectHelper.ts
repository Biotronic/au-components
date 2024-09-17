export class ObjectHelper {
  /**
   * Returns true if object is not null and is defined.
   * @param obj The object to test.
   */
  public static hasValue(obj: any) {
      return (obj !== null && typeof obj !== 'undefined');
  }

  public static hasValues<T>(obj: T, ...keys: (keyof T)[]) {
      return keys.every(k => ObjectHelper.hasValue(obj[k]));
  }
}
