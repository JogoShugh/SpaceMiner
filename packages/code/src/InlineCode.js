import React from 'react';
import styled from 'react-emotion';
import * as PropTypes from 'prop-types';

const Code = styled('code') `
  background-color: rgba(27,31,35,0.05);
  border-radius: 3px;
  box-sizing: border-box;
  font-family: "SFMono-Regular",Consolas,"Liberation Mono",Menlo,Courier,monospace;
  font-size: 85%;
  margin: 0;
  padding: 0.2em 0.4em;
`;

export default function InlineCode({ children }) {
  return (
    <Code>{children}</Code>
  );
}
InlineCode.propTypes = {
  /**
   * code snippet string
   */
  children: PropTypes.string.isRequired,
};
