import { ITag } from 'utils/types';

export function getUniqueTags(arr: ITag[], key: string): ITag[] {
  return arr.filter(
    (tag, index, tagArray) =>
      tagArray.findIndex((t) => t[key].toLowerCase() === tag[key].toLowerCase() && t[key].toLowerCase() === tag[key].toLowerCase()) === index,
  );
}
