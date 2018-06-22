import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import UIAnalyticsEvent from './UIAnalyticsEvent';

export default (eventsMap = {}) => WrappedComponent => class extends Component {
  static displayName = `WithAnalytics(${WrappedComponent.displayName || WrappedComponent.name})`;
  static contextTypes = {
    getAnalyticsEventHandlers: PropTypes.func,
    getAnalyticsContext: PropTypes.func,
  }
  render() {
    const props = { ...this.props, ...this.mapEvents() };
    return (
      <WrappedComponent {...props} createAnalyticsEvent={this.createAnalyticsEvent} />
    );
  }

  createAnalyticsEvent = payload => {
    const {
      getAnalyticsEventHandlers,
      getAnalyticsContext,
    } = this.context;

    const context =
      (typeof getAnalyticsContext === 'function' &&
        getAnalyticsContext()) ||
      [];
    const handlers =
      (typeof getAnalyticsEventHandlers === 'function' &&
        getAnalyticsEventHandlers()) ||
      [];
    return new UIAnalyticsEvent({ context, handlers, payload });
  };

  mapEvents = () => Object.keys(eventsMap)
    .reduce((prev, propCallbackName) => {
      const eventCreator = eventsMap[propCallbackName];
      if (!['object', 'function'].includes(typeof eventCreator)) {
        return prev;
      }

      const providedPropCallback = this.props[propCallbackName];
      const modifiedCallback = (...args) => {
        const analyticsEvent = typeof eventCreator === 'function'
          ? eventCreator(this.createAnalyticsEvent, this.props)
          : this.createAnalyticsEvent(eventCreator);

        if (providedPropCallback) {
          providedPropCallback(...args, analyticsEvent);
        }
      };

      return {
        ...prev,
        [propCallbackName]: modifiedCallback,
      };
    }, {});
}
