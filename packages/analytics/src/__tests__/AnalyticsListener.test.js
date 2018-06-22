import React from 'react';
import { mount, shallow } from 'enzyme';
import { noop } from 'lodash';
import * as PropTypes from 'prop-types';
import AnalyticsListener from '../AnalyticsListener';

test('it renders', () => {
  const wrapper = shallow(
    <AnalyticsListener onEvent={noop}>
      <div />
    </AnalyticsListener>,
  );

  expect(wrapper.find('div')).toHaveLength(1);
});

test('exposes onEvent prop callback via react context callback', () => {
  const eventHandler = jest.fn();
  let analyticsEventHandlers;
  const getHandlers = handlers => {
    analyticsEventHandlers = handlers;
  };
  const wrapper = mount(
    <AnalyticsListener onEvent={eventHandler}>
      <ContextConsumer onClick={getHandlers} />
    </AnalyticsListener>,
  );
  wrapper.find(ContextConsumer).simulate('click');
  analyticsEventHandlers[0]();

  expect(analyticsEventHandlers.length).toBe(1);
  expect(eventHandler).toHaveBeenCalled();
});

function ContextConsumer(
  { onClick },
  context,
) {
  const contextConsumerOnClick = () => {
    const eventHandlers = context.getAnalyticsEventHandlers();
    onClick(eventHandlers);
  };
  return <button onClick={contextConsumerOnClick} />;
};
ContextConsumer.contextTypes = {
  getAnalyticsEventHandlers: PropTypes.func.isRequired,
};

test('adds ancestor analytics event handlers to getAnalyticsEventHandlers react context callback', () => {
  const innerHandler = jest.fn();
  const outerHandler = jest.fn();
  let analyticsEventHandlers;
  const getHandlers = handlers => {
    analyticsEventHandlers = handlers;
  };
  const wrapper = mount(
    <AnalyticsListener onEvent={outerHandler}>
      <AnalyticsListener onEvent={innerHandler}>
        <ContextConsumer onClick={getHandlers} />
      </AnalyticsListener>
    </AnalyticsListener>,
  );
  wrapper.find(ContextConsumer).simulate('click');
  analyticsEventHandlers[0]();
  analyticsEventHandlers[1]();

  expect(analyticsEventHandlers.length).toBe(2);
  expect(innerHandler).toHaveBeenCalled();
  expect(outerHandler).toHaveBeenCalled();
});
