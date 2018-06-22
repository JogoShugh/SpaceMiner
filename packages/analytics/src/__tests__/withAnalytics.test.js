import React, { Component } from 'react';
import { mount, shallow } from 'enzyme';
import * as PropTypes from 'prop-types';
import withAnalytics from '../withAnalytics';
import UIAnalyticsEvent from '../UIAnalyticsEvent';

test('it should render the provided component', () => {
  const ButtonWithAnalytics = withAnalytics()(Button);
  const wrapper = shallow(<ButtonWithAnalytics>Hello</ButtonWithAnalytics>);
  expect(wrapper.html()).toBe('<button>Hello</button>');
});

test('the component has a descriptive display name', () => {
  const ButtonWithAnalytics = withAnalytics()(Button);
  expect(ButtonWithAnalytics.displayName).toEqual('WithAnalytics(Button)');

  const ClassButtonWithAnalytics = withAnalytics()(ClassButton);
  expect(ClassButtonWithAnalytics.displayName).toEqual('WithAnalytics(ClassButton)');
});

test('passes a createAnalyticsEvent function prop to the wrapped component', () => {
  const ButtonWithAnalytics = withAnalytics()(Button);
  const wrapper = shallow(<ButtonWithAnalytics>Hello</ButtonWithAnalytics>);

  expect(typeof wrapper.find(Button).prop('createAnalyticsEvent')).toBe('function');
});

describe('createAnalyticsEvent function prop', () => {
  test('should return a new UI Analytics Event with specified action and payload', () => {
    let analyticsEvent;

    const ButtonWithAnalytics = withAnalytics()(ButtonWithCreate);
    const wrapper = mount(
      <ButtonWithAnalytics
        onClick={(e, buttonAnalyticsEvent) => {
          analyticsEvent = buttonAnalyticsEvent;
        }}
      >
        Hello
      </ButtonWithAnalytics>,
    );

    wrapper.find('ButtonWithCreate').simulate('click');

    expect(analyticsEvent).toEqual(expect.any(UIAnalyticsEvent));
    expect(analyticsEvent.payload).toEqual({ action: 'some action' });
  });

  test('retrieves analytics context and handlers from react context and pass through to event', () => {
    let analyticsEvent;
    const eventHandler = jest.fn();

    const ButtonWithAnalytics = withAnalytics()(ButtonWithCreate);
    const wrapper = mount(
      <ButtonWithAnalytics
        onClick={(e, buttonAnalyticsEvent) => {
          analyticsEvent = buttonAnalyticsEvent;
        }}
      >
        Hello
      </ButtonWithAnalytics>,
      {
        context: {
          getAnalyticsContext: () => [
            { a: 'b' },
            { c: 'd' },
            { a: 'e' },
          ],
          getAnalyticsEventHandlers: () => [eventHandler],
        },
      },
    );

    wrapper.find('ButtonWithCreate').simulate('click');

    expect(analyticsEvent).toEqual(expect.any(UIAnalyticsEvent));
    expect(analyticsEvent.context).toEqual([
      { a: 'b' },
      { c: 'd' },
      { a: 'e' },
    ]);
    expect(analyticsEvent.handlers).toEqual([eventHandler]);
  });
});

describe('map event to props', () => {
  test('patches callback props to create an event when passed a string', () => {
    let analyticsEvent;
    const ButtonWithAnalytics = withAnalytics({
      onClick: { action: 'clicked' },
    })(Button);
    const wrapper = mount(
      <ButtonWithAnalytics
        onClick={(e, buttonAnalyticsEvent) => {
          analyticsEvent = buttonAnalyticsEvent;
        }}
      >
        Hello
      </ButtonWithAnalytics>,
    );

    wrapper.find('Button').simulate('click');

    expect(analyticsEvent).toEqual(expect.any(UIAnalyticsEvent));
    expect(analyticsEvent.payload).toEqual({ action: 'clicked' });
  });

  test('patches callback props to create an event when passed a function', () => {
    let analyticsEvent;
    const ButtonWithAnalytics = withAnalytics({
      onClick: createEvent => createEvent({ action: 'clicked' }),
    })(Button);
    const wrapper = mount(
      <ButtonWithAnalytics
        onClick={(e, buttonAnalyticsEvent) => {
          analyticsEvent = buttonAnalyticsEvent;
        }}
      >
        Hello
      </ButtonWithAnalytics>,
    );

    wrapper.find('Button').simulate('click');

    expect(analyticsEvent).toEqual(expect.any(UIAnalyticsEvent));
    expect(analyticsEvent.payload).toEqual({ action: 'clicked' });
  });

  test('provides component props to mapEventsToProps callback handlers', () => {
    let analyticsEvent;
    const ButtonWithAnalytics = withAnalytics({
      onClick: (createEvent, props) => createEvent({ action: 'clicked', eventTest: props.propTest }),
    })(Button);
    const wrapper = mount(
      <ButtonWithAnalytics
        onClick={(e, buttonAnalyticsEvent) => {
          analyticsEvent = buttonAnalyticsEvent;
        }}
        propTest="test"
      >
        Hello
      </ButtonWithAnalytics>,
    );

    wrapper.find('Button').simulate('click');

    expect(analyticsEvent).toEqual(expect.any(UIAnalyticsEvent));
    expect(analyticsEvent.payload).toEqual({ action: 'clicked', eventTest: 'test', });
  });

  test('should update handlers each render', () => {
    const analyticsEvents = [];
    const ButtonWithAnalytics = withAnalytics({
      onClick: createEvent =>
        createEvent({ action: 'clicked', time: Date.now() }),
    })(Button);
    class Counter extends Component {
      state = { count: 0 };
      render() {
        const { count } = this.state;
        return (
          <ButtonWithAnalytics
            onClick={(event, buttonAnalyticsEvent) => {
              analyticsEvents.push(buttonAnalyticsEvent);
              this.setState({ count: count + 1 })
            }}
          >
            {count}
          </ButtonWithAnalytics>
        );
      }
    }

    const wrapper = mount(<Counter />);
    wrapper.find(Button).simulate('click');
    wrapper.find(Button).simulate('click');
    const analyticsEventPayloadsAreUpdated = analyticsEvents.reduce((prev, analyticsEvent, index, events) => prev && (index === 0 || analyticsEvent.payload.time > events[index - 1].payload.time), true);
    expect(analyticsEventPayloadsAreUpdated).toBeTruthy();
  });
});

function Button({ children, onClick }) {
  return (
    <button onClick={onClick}>{children}</button>
  );
}

class ClassButton extends Component {
  render() {
    const {
      children,
      onClick,
    } = this.props;
    return (
      <button onClick={onClick}>{children}</button>
    );
  }
}

class ButtonWithCreate extends Component {
  handleClick = e => {
    const { createAnalyticsEvent, onClick } = this.props;
    if (onClick) {
      onClick(e, createAnalyticsEvent({ action: 'some action' }));
    }
  };

  render() {
    return <button onClick={this.handleClick}>{this.props.children}</button>;
  }
}
