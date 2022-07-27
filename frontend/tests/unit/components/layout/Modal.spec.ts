import type { VueWrapper } from '@vue/test-utils';
import { mount } from '@vue/test-utils';

import Modal from '@/components/layout/Modal.vue';

function createWrapper(props = {}, global = {}) {
  return mount(Modal, {
    shallow: true,
    props: {
      triggerText: 'trigger',
      ...props,
    },
    global: {
      ...global,
    },
    attachTo: document.body,
  });
}

const openModal = async function (wrapper: VueWrapper) {
  const openButton = wrapper.find('[data-test="open-button"]');
  await openButton.trigger('click');
};
const closeModal = async function (wrapper: VueWrapper) {
  const closeButton = wrapper.find('[data-test="close-button"]');
  await closeButton.trigger('click');
};

describe('Modal.vue', () => {
  /*
   * Having this ugly open-and-close test is not so nice. Unfortunately because
   * the opening state variable can't be modified, this is the "only" way to
   * test it right now.
   */
  it('can open and close content box', async () => {
    const wrapper = createWrapper();

    const openButton = wrapper.find('[data-test="open-button"]');

    expect(openButton.exists()).toBeTruthy();
    expect(wrapper.find('[data-test="content-box"]').exists()).toBeFalsy();

    await openModal(wrapper);

    const closeButton = wrapper.find('[data-test="close-button"]');

    expect(wrapper.find('[data-test="content-box"]').exists()).toBeTruthy();
    expect(closeButton.exists()).toBeTruthy();

    await closeModal(wrapper);

    expect(wrapper.find('[data-test="content-box"]').exists()).toBeFalsy();
  });

  describe('when content box is opened', () => {
    let wrapper: VueWrapper;
    beforeEach(async () => {
      wrapper = createWrapper();
      await openModal(wrapper);
    });

    it('renders some content', async () => {
      const contentBox = wrapper.get('[data-test="content-box"]');
      expect(contentBox.text().length).toBeGreaterThan(0);
    });

    describe('when close on backdrop click functionality is active', () => {
      it('closes content box on backdrop click', async () => {
        wrapper = createWrapper({
          closeOnClickOut: true,
        });
        await openModal(wrapper);
        const backdrop = wrapper.find('[data-test="backdrop"]');
        await backdrop.trigger('click');
        expect(wrapper.find('[data-test="content-box"]').exists()).toBeFalsy();
      });
    });
    describe('when close on backdrop click functionality is inactive', () => {
      it('does not close content box on backdrop click', async () => {
        wrapper = createWrapper({
          closeOnClickOut: false,
        });
        await openModal(wrapper);
        const backdrop = wrapper.find('[data-test="backdrop"]');
        await backdrop.trigger('click');
        expect(wrapper.find('[data-test="content-box"]').exists()).toBeTruthy();
      });
    });
  });
});
