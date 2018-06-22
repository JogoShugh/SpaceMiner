import { CodeBlock, InlineCode } from '../';
import CodeBlockSrc from '../CodeBlock';
import InlineCodeSrc from '../InlineCode';

test('a CodeBlock component is exported', () => {
  expect(CodeBlock).toEqual(CodeBlockSrc);
});

test('InlineCode component is exported', () => {
  expect(InlineCode).toEqual(InlineCodeSrc);
});
