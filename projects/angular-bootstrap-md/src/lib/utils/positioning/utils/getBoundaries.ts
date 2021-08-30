/**
 * Computed the boundaries limits and return them
 */
import { getScrollParent } from './getScrollParent';
import { getParentNode } from './getParentNode';
import { findCommonOffsetParent } from './findCommonOffsetParent';
import { getOffsetRectRelativeToArbitraryNode } from './getOffsetRectRelativeToArbitraryNode';
import { getViewportOffsetRectRelativeToArtbitraryNode } from './getViewportOffsetRectRelativeToArtbitraryNode';
import { getWindowSizes } from './getWindowSizes';
import { isFixed } from './isFixed';
import { getFixedPositionOffsetParent } from './getFixedPositionOffsetParent';

export function getBoundaries(
  target: any,
  host: HTMLElement,
  padding = 0,
  boundariesElement: string,
  fixedPosition = false
) {
  // NOTE: 1 DOM access here

  let boundaries: any = { top: 0, left: 0 };
  const offsetParent = fixedPosition ? getFixedPositionOffsetParent(target) : findCommonOffsetParent(target, host);

  // Handle viewport case
  if (boundariesElement === 'viewport') {
    boundaries = getViewportOffsetRectRelativeToArtbitraryNode(offsetParent, fixedPosition);
  } else {
    // Handle other cases based on DOM element used as boundaries
    let boundariesNode;
    if (boundariesElement === 'scrollParent') {
      boundariesNode = getScrollParent(getParentNode(host));
      if (boundariesNode.nodeName === 'BODY') {
        boundariesNode = target.ownerDocument.documentElement;
      }
    } else if (boundariesElement === 'window') {
      boundariesNode = target.ownerDocument.documentElement;
    } else {
      boundariesNode = boundariesElement;
    }

    const offsets = getOffsetRectRelativeToArbitraryNode(
      boundariesNode,
      offsetParent,
      fixedPosition
    );

    // In case of HTML, we need a different computation
    if (boundariesNode.nodeName === 'HTML' && !isFixed(offsetParent)) {
      const { height, width } = getWindowSizes(target.ownerDocument);
      boundaries.top += offsets.top - offsets.marginTop;
      boundaries.bottom = Number(height) + Number(offsets.top);
      boundaries.left += offsets.left - offsets.marginLeft;
      boundaries.right = Number(width) + Number(offsets.left);
    } else {
      // for all the other DOM elements, this one is good
      boundaries = offsets;
    }
  }

  // Add paddings
  boundaries.left += padding;
  boundaries.top += padding;
  boundaries.right -= padding;
  boundaries.bottom -= padding;

  return boundaries;
}
