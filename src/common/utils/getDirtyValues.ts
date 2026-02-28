export function getChangedData<T extends Record<string, any>>(
  original: T,
  current: T,
): Partial<T> {
  const changes: Partial<T> = {};

  // Iterate over the keys of the current object
  Object.keys(current).forEach((key) => {
    const k = key as keyof T;
    // Strict equality check (adjust for deep comparison if you have nested objects)
    if (original[k] !== current[k]) {
      changes[k] = current[k];
    }
  });

  return changes;
}
