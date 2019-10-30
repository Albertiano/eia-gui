export class NumeroConversor {

  constructor() {}

  parse(value): number {
    if (typeof value === 'number') {
      return value;
    }
    if (value) {
      const v = value
      .replace('.', '')
      .replace(',', '.');
    return Number(v);
    } else {
      return Number(0);
    }
  }
}
