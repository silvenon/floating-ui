// @flow
import type { Rect } from '../types';
import getBoundingClientRect from './getBoundingClientRect';
import listScrollParents from './listScrollParents';
import getScrollSum from './getScrollSum';
import getOffsetParent from './getOffsetParent';

// Returns the width, height and offsets of the provided element relative to the
// offsetParent
export default (element: Element): Rect => {
  const rect = getBoundingClientRect(element);
  const scrollParentsScrollSum = getScrollSum(listScrollParents(element));
  const directOffsetParent = getOffsetParent(element);
  const directOffsetParentRect =
    directOffsetParent instanceof Element
      ? getBoundingClientRect(directOffsetParent)
      : { left: 0, top: 0 };

  const ancestorOffsetParents = [];
  let currentOffsetParent = directOffsetParent;

  while (currentOffsetParent instanceof Element) {
    currentOffsetParent = getOffsetParent(currentOffsetParent);
    ancestorOffsetParents.push(currentOffsetParent);
  }

  const ancestorOffsetParentScrollSum = getScrollSum(ancestorOffsetParents);

  const width = rect.width;
  const height = rect.height;
  const x =
    rect.left +
    scrollParentsScrollSum.scrollLeft -
    ancestorOffsetParentScrollSum.scrollLeft -
    directOffsetParentRect.left;
  const y =
    rect.top +
    scrollParentsScrollSum.scrollTop -
    ancestorOffsetParentScrollSum.scrollTop -
    directOffsetParentRect.top;

  return { width, height, x, y };
};