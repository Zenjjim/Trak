import { ITag } from './types';

export function getUniqueTags(arr: ITag[], key: string): ITag[] {
  return arr.filter((v, i, a) => a.findIndex((t) => t[key].toLowerCase() === v[key].toLowerCase() && t[key].toLowerCase() === v[key].toLowerCase()) === i);
}
