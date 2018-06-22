import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import AnalyticsContext from './AnalyticsContext';

export default (contextData = {}) => WrappedComponent => class extends Component {
  static displayName = `WithAnalyticsContext(${WrappedComponent.displayName || WrappedComponent.name})`;
  static propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    analyticsContext: PropTypes.any,
  }
  render() {
    const {
      analyticsContext, ...props
    } = this.props;
    const data = {
      ...contextData,
      ...analyticsContext,
    };

    return (
      <AnalyticsContext data={data}>
        <WrappedComponent {...props} />
      </AnalyticsContext>
    )
  }
};
