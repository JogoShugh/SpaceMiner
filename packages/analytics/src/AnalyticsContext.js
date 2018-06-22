import { Children, Component } from 'react';
import * as PropTypes from 'prop-types';

const contextTypes = {
  getAnalyticsContext: PropTypes.func,
};

export default class AnalyticsContext extends Component {
  static contextTypes = contextTypes;
  static childContextTypes = contextTypes;

  getChildContext = () => ({
    getAnalyticsContext: this.getAnalyticsContext,
  });

  getAnalyticsContext = () => {
    const { data } = this.props;
    const { getAnalyticsContext } = this.context;
    const ancestorData = typeof getAnalyticsContext === 'function'
      ? getAnalyticsContext()
      : [];
    return [
      ...ancestorData,
      data,
    ];
  };

  render() {
    return Children.only(this.props.children);
  }
}
AnalyticsContext.propTypes = {
  children: PropTypes.node.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  /**
   * additional data to be passed along as context to fired analytics events
   */
  data: PropTypes.any.isRequired,
};
