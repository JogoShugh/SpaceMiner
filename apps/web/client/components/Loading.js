import React from 'react';
import * as PropTypes from 'prop-types';

export default function Loading({ error, pastDelay, timedOut }) {
  if (error) {
    throw new Error(`Error: ${error}`);
  }
  if (timedOut) {
    throw new Error('Time out');
  }
  if (pastDelay) {
    return <div>Loading...</div>
  }
  return null;
};
Loading.propTypes = {
  error: PropTypes.string,
  pastDelay: PropTypes.bool,
  timedOut: PropTypes.bool,
};
