import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter/prism';
import virtualizedRenderer from 'react-syntax-highlighter-virtualized-renderer';
import { ghcolors } from 'react-syntax-highlighter/styles/prism';
import * as PropTypes from 'prop-types';
import supportedLanguages from './supportedLanguages';

ghcolors["pre[class*=\"language-\"]"].backgroundColor = 'rgba(27,31,35,0.05)';

export default function CodeBlock({
  children,
  height,
  language,
  lineNumberStyle,
  shouldShowLineNumbers,
  startingLineNumber,
  style,
  theme,
}) {
  return (
    <SyntaxHighlighter
      customStyle={{
        ...style,
        height,
      }}
      language={language}
      lineNumberStyle={lineNumberStyle}
      renderer={height ? virtualizedRenderer() : undefined}
      showLineNumbers={shouldShowLineNumbers}
      startingLineNumber={startingLineNumber}
      style={theme}
      wrapLines
    >
      {children}
    </SyntaxHighlighter>
  );
}
CodeBlock.propTypes = {
  /**
   * code snippet string
   */
  children: PropTypes.string.isRequired,
  /**
   * code block height; will virtualize code block when code scrolls beyond height prop
   */
  height: PropTypes.string,
  /**
   * language of code snippet; must be a supported language
   */
  language: PropTypes.oneOf(supportedLanguages).isRequired,
  /**
   * used to apply styles to each individual line; function accepts `lineNumber` as parameter
   * @example lineNumberStyle: lineNumber => lineNumber === 1 ? { color: 'blue' } : {},
   */
  lineNumberStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  /**
   * displays line numbers when true
   */
  shouldShowLineNumbers: PropTypes.bool,
  /**
   * line number to start on within code block
   */
  startingLineNumber: PropTypes.number,
  /**
   * override styles applied to the `<pre />` tag root element
   */
  style: PropTypes.object,
  /**
   * `react-syntax-highlighter/styles/prism` theme that provides styling to code
   */
  theme: PropTypes.object,
};
CodeBlock.defaultProps = {
  height: null,
  lineNumberStyle: null,
  shouldShowLineNumbers: false,
  startingLineNumber: 1,
  style: {},
  theme: ghcolors,
};
