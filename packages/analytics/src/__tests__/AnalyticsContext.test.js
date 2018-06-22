import React from 'react';
import { mount, shallow } from 'enzyme';
import * as PropTypes from 'prop-types';
import AnalyticsContext from '../AnalyticsContext';

test('renders', () => {
  const wrapper = shallow(
    <AnalyticsContext data={{}}>
      <div />
    </AnalyticsContext>,
  );

  expect(wrapper.find('div')).toHaveLength(1);
});

test('cannot create a component with multiple children', () => {
  expect(() => {
    shallow(
      <AnalyticsContext data={{}}>
        <div />
        <div />
      </AnalyticsContext>,
    );
  }).toThrow();
});

test("adds analytics context data to child's getAnalyticsContext context callback", () => {
  let analyticsContext;
  const getContext = context => {
    analyticsContext = context;
  };
  const wrapper = mount(
    <AnalyticsContext data={{ additional: 'data' }}>
      <ContextConsumer onClick={getContext} />
    </AnalyticsContext>,
  );
  wrapper.find(ContextConsumer).simulate('click');

  expect(analyticsContext).toEqual([{ additional: 'data' }]);
});

test("prepends analytics context data from ancestors to child's getAnalyticsContext context callback", () => {
  let analyticsContext;
  const getContext = context => {
    analyticsContext = context;
  };
  const wrapper = mount(
    <AnalyticsContext data={{ additional: 'data' }}>
      <AnalyticsContext data={{ someOtherAdditional: 'data' }}>
        <AnalyticsContext data={{ additional: 'more data' }}>
          <ContextConsumer onClick={getContext} />
        </AnalyticsContext>
      </AnalyticsContext>
    </AnalyticsContext>,
  );
  wrapper.find(ContextConsumer).simulate('click');

  expect(analyticsContext).toEqual([{ additional: 'data' }, { someOtherAdditional: 'data' }, { additional: 'more data' }]);
});


function ContextConsumer(
  props,
  context,
) {
  const onClick = () => {
    const analyticsContext = context.getAnalyticsContext();
    props.onClick(analyticsContext);
  };
  return <button onClick={onClick} />;
};
ContextConsumer.contextTypes = {
  getAnalyticsContext: PropTypes.func,
};
