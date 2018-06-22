import React from 'react';
import { shallow } from 'enzyme';
import CodeBlock from '../CodeBlock';

test('a code string without a language is rendered with a generic language formatting', () => {
  expect(shallow(<CodeBlock language="bash">ls -a</CodeBlock>)).toMatchSnapshot();
});

test('component can be configured to render a specific language', () => {
  expect(shallow(<CodeBlock language="bash">ls -a</CodeBlock>)).toMatchSnapshot();
});

test('optionally render line numbers', () => {
  expect(
    shallow(
      <CodeBlock language="bash" shouldShowLineNumbers>
        ls -a
      </CodeBlock>,
    ),
  ).toMatchSnapshot();
});
test('optionally start at line numbers at a given number', () => {
  expect(
    shallow(
      <CodeBlock language="bash" shouldShowLineNumbers startingLineNumber={10}>
        ls -a
      </CodeBlock>,
    ),
  ).toMatchSnapshot();
});

test('defaults to starting line number at 1', () => {
  expect(
    shallow(
      <CodeBlock language="bash" shouldShowLineNumbers>
        ls -a
      </CodeBlock>,
    ),
  ).toMatchSnapshot();
});

test('can apply a style object to each line', () => {
  expect(
    shallow(<CodeBlock language="bash" lineNumberStyle={{ color: 'blue' }}>ls -a</CodeBlock>),
  ).toMatchSnapshot();
});
