import { isNil } from 'ramda';

export function assertRequired<O extends {}>(
  object: O,
): asserts object is Required<O> {
  Object.entries(object).forEach(([key, value]) => {
    if (typeof value === 'object' && value !== null) {
      assertRequired(value);
    }
    if (isNil(value)) {
      throw new Error(`Key ${key} is required, but the provided value is nil`);
    }
  });
}
