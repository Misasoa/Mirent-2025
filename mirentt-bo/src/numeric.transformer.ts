import { ValueTransformer } from 'typeorm';

export class NumericTransformer implements ValueTransformer {
  to(data: number | null): number | null {
    return data;
  }

  from(data: string | null): number | null {
    if (data === null || data === undefined) {
      return null;
    }
    return parseFloat(data);
  }
}
