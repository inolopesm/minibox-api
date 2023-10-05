export function removeUndefined(
  object: Record<string, string | undefined>,
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(object).reduce<Array<[string, string]>>(
      (array, [key, value]) =>
        value !== undefined ? [...array, [key, value]] : array,
      [],
    ),
  );
}

export function removeId<T extends { id: number }>(object: T): Omit<T, "id"> {
  const { id, ...rest } = object;
  return rest;
}
