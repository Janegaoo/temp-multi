/*
 * @Author: Jane
 * @Date: 2020-05-18 14:01:07
 * @LastEditors: Jane
 * @LastEditTime: 2020-05-20 10:58:43
 * @Descripttion:
 */
import { expect } from 'chai';
import { shallowMount } from '@vue/test-utils';
import HelloWorld from '@/components/HelloWorld.vue';
import { describe, it } from '@vue/cli-plugin-unit-mocha';

describe('HelloWorld.vue', () => {
  it('renders props.msg when passed', () => {
    const msg = 'new message';
    const wrapper = shallowMount(HelloWorld, {
      propsData: { msg },
    });
    expect(wrapper.text()).to.include(msg);
  });
});
