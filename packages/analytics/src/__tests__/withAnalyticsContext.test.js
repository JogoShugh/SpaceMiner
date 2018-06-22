import React, { Component } from 'react';
import { shallow } from 'enzyme';
import AnalyticsContext from '../AnalyticsContext';
import withAnalyticsContext from '../withAnalyticsContext';

test('rendering', () => {
  const ButtonWithContext = withAnalyticsContext()(Button);
  const wrapper = shallow(<ButtonWithContext>Hello</ButtonWithContext>);

  expect(wrapper.html()).toBe('<button>Hello</button>');
});

test('display name is descriptive', () => {
  const ButtonWithContext = withAnalyticsContext()(Button);
  const ClassButtonWithContext = withAnalyticsContext()(ClassButton);
  expect(ButtonWithContext.displayName).toEqual('WithAnalyticsContext(Button)');
  expect(ClassButtonWithContext.displayName).toEqual('WithAnalyticsContext(ClassButton)');
});

test('wraps component with analytics context', () => {
  const ButtonWithContext = withAnalyticsContext()(Button);
  const wrapper = shallow(<ButtonWithContext>Hello</ButtonWithContext>);

  expect(
    wrapper.equals(
      <AnalyticsContext data={{}}>
        <Button>Hello</Button>
      </AnalyticsContext>,
    ),
  ).toBe(true);
});

test('additional context data can be injected into wrapped analytics context', () => {
  const data = {
    additional: 'context data',
  };
  const ButtonWithContext = withAnalyticsContext(data)(Button);
  const wrapper = shallow(<ButtonWithContext>Hello</ButtonWithContext>);

  expect(
    wrapper.equals(
      <AnalyticsContext data={data}>
        <Button>Hello</Button>
      </AnalyticsContext>,
    ),
  ).toBe(true);
});

test('can pass analyticsContext prop data to analytics context component', () => {
  const ButtonWithContext = withAnalyticsContext()(Button);
  const wrapper = shallow(
    <ButtonWithContext analyticsContext={{ data: 'some context data' }}>
      Hello
    </ButtonWithContext>,
  );

  expect(
    wrapper.equals(
      <AnalyticsContext data={{ data: 'some context data' }}>
        <Button>Hello</Button>
      </AnalyticsContext>,
    ),
  ).toBe(true);
});

test('passes an empty object to analytics context if no provided or prop value is defined', () => {
  const ButtonWithContext = withAnalyticsContext()(Button);
  const wrapper = shallow(<ButtonWithContext>Hello</ButtonWithContext>);

  expect(
    wrapper.equals(
      <AnalyticsContext data={{}}>
        <Button>Hello</Button>
      </AnalyticsContext>,
    ),
  ).toBe(true);
});

function Button({ children }) {
  return <button>{children}</button>;
}

class ClassButton extends Component {
  render() {
    return <div />;
  }
}
