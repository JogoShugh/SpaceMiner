import React from 'react';
import stringRaw from 'string-raw';
import { CodeBlock } from '@space-miner/code';

export default function code(sources, ...substitutions) {
  const source = stringRaw(sources, substitutions).replace(/^(\s*\n)+/g, '').replace(/(\n\s*)+$/g, '');

  return (
    <CodeBlock language="javascript">
      {source}
    </CodeBlock>
  );
}
