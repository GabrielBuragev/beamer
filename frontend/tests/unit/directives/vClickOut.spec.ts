import { mount } from '@vue/test-utils';
import { defineComponent } from 'vue';

import type { Param } from '@/directives/vClickOut';
import { vClickOut } from '@/directives/vClickOut';

const createComponent = (cb: Param = vi.fn()) =>
  defineComponent({
    directives: {
      ClickOut: vClickOut,
    },
    data() {
      return {
        cb,
      };
    },
    template: `<div data-test='outer-box'>
    <div v-clickOut="cb">Foo</div>
  </div>`,
  });

const createWrapper = (component = createComponent()) => {
  return mount(component, {
    global: {
      directives: {
        vClickOut,
      },
    },
    attachTo: document.body,
  });
};

describe('vClickOut', () => {
  describe('in active state', () => {
    // Directive active state is being triggered when provided a function as a param
    const cb = vi.fn();

    it('triggers callback when user clicks outside of directive scope', async () => {
      const component = createComponent(cb);
      const wrapper = createWrapper(component);
      const outerBox = wrapper.find('[data-test="outer-box"]');
      await outerBox.trigger('click');
      expect(cb).toHaveBeenCalledOnce();
    });

    it('listens for click events', () => {
      window.addEventListener = vi.fn();
      const component = createComponent(cb);
      createWrapper(component);
      expect(window.addEventListener).toHaveBeenCalledOnce();
    });

    it('tears down event listeners on unmount', () => {
      window.removeEventListener = vi.fn();
      const component = createComponent(cb);
      const wrapper = createWrapper(component);
      wrapper.unmount();
      expect(window.removeEventListener).toHaveBeenCalledOnce();
    });
  });

  describe('in inactive state', () => {
    // Directive inactive state is being triggered when provided a `false` value as a param
    const cb = false;

    it('it does not listen to click events', () => {
      window.addEventListener = vi.fn();
      const component = createComponent(cb);
      createWrapper(component);
      expect(window.addEventListener).not.toHaveBeenCalledOnce();
    });
  });
});
