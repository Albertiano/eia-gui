export class NumeroConversor {

  constructor() {}

  parse(value): number {
    if (typeof value === 'number') {
      return value;
    }
    const v = value
      .replace('.', '')
      .replace(',', '.');
    return Number(v);
  }
}
