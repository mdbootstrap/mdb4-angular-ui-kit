import { Data, Offsets } from '../models/index';

export function getOffsets(data: Data): Offsets {
  return {
    width: data.offsets.target.width,
    height: data.offsets.target.height,
    left: Math.floor(data.offsets.target.left),
    top: Math.round(data.offsets.target.top),
    bottom: Math.round(data.offsets.target.bottom),
    right: Math.floor(data.offsets.target.right)
  };
}
