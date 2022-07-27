/* eslint-disable @typescript-eslint/ban-types */
import type { ObjectDirective } from 'vue';

type EventHandler = (e: Event) => void;
export type Param = Function | false;

let clickHandler: EventHandler | null | undefined;

const getClickHandler = (el: HTMLElement, cb: Function) => (e: Event) => {
  // Check if user clicked outside focused area
  if (e.target !== el && !el.contains(e.target as Node)) {
    cb();
  }
};

const attachClickHandler = (clickHandler: EventHandler) => {
  window.addEventListener('click', clickHandler);
};

const detachClickHandler = (clickHandler: EventHandler) => {
  window.removeEventListener('click', clickHandler);
};
/**
 * Directive used for triggering actions when a DOM element loses its focus (user clicks outside of it).
 *
 * Goes in `active` state when a method is provided as a param which is then used as a handler (callback) when conditions are met.
 * Goes in `inactive` state when a `false` value is provided as a param after which it stops listening for events.
 *
 * Supports reactive params and updates its state accordingly on param change.
 */
export const vClickOut: ObjectDirective<HTMLElement, Param> = {
  mounted: async (el: HTMLElement, binding) => {
    const action = binding.value;
    if (action) {
      clickHandler = getClickHandler(el, action);
      attachClickHandler(clickHandler);
    }
  },
  updated: (el, binding) => {
    if (clickHandler) {
      detachClickHandler(clickHandler);
      clickHandler = null;
    }

    const action = binding.value;
    if (action) {
      clickHandler = getClickHandler(el, action);
      attachClickHandler(clickHandler);
    }
  },
  unmounted() {
    if (clickHandler) {
      detachClickHandler(clickHandler);
      clickHandler = null;
    }
  },
};
