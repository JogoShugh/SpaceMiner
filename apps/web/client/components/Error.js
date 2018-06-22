import React from 'react';
import styled from 'react-emotion';
import * as PropTypes from 'prop-types';

const ErrorSummaryBlock = styled('blockquote') `
background: pink;
border: 1px solid darkred;
color: darkred;
margin: 2rem;
`;

export default function Error({ message, stack }) {
  return (
    <ErrorSummaryBlock>
      <strong>Error</strong>
      <div>{message}</div>
      <div>{stack}</div>
    </ErrorSummaryBlock>
  )
}
Error.propTypes = {
  message: PropTypes.string,
  stack: PropTypes.string,
};
Error.defaultProps = {
  message: 'Unknown Error',
  stack: '',
};
