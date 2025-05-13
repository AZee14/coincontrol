export function flattenFirstLevel(arr: any[]): any[] {
  return arr.reduce((acc, curr) => {
    return Array.isArray(curr) ? [...acc, ...curr] : [...acc, curr];
  }, []);
}
