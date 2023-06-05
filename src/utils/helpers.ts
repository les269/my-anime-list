type Key = string | number;

export function get<T>(
  object: Record<Key, any>,
  path: Key | Key[],
  defaultValue?: T
): T | undefined {
  const pathArray = Array.isArray(path) ? path : [path];
  let result: any = object;
  for (const key of pathArray) {
    result = result?.[key];
    if (result === undefined) {
      return defaultValue;
    }
  }
  return result;
}

export const isBlank = (str: string | null | undefined): boolean =>
  str === null || str === undefined || str.trim() === "";

export const replace = (str: string | null | undefined): string =>
  isBlank(str) ? "" : str?.trim()!;

export const isNumeric = (value: any): boolean =>
  !isNaN(parseFloat(value)) && isFinite(value);

export const isEmpty = (value: any): boolean =>
  value === undefined || value === null || value.length === 0;

export const clone = (value: any): any => JSON.parse(JSON.stringify(value));

// export const isDate = (value: any): boolean =>
//   !isNaN(value) && value instanceof Date;
