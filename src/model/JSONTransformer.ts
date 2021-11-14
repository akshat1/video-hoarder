import { ValueTransformer } from "typeorm";

export interface TypedJSONTransformer<T> extends ValueTransformer {
  to: (unmarshalled: T) => string;
  from: (marshalled: string) => T;
}

export function getJSONTransformer<T>(): TypedJSONTransformer<T> {
  return {
    to: (unmarshalled: T) => JSON.stringify(unmarshalled),
    from: (marshalled: string) => JSON.parse(marshalled),
  };
}
