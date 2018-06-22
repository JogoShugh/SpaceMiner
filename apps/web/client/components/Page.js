import styled from 'react-emotion';

const containerWidth = {
  small: '480px',
  medium: '640px',
  large: '980px',
  xlarge: '1660px',
};

const Page = styled('main') `
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  max-width: ${p =>
    containerWidth[p.width] ? containerWidth[p.width] : containerWidth.medium};
  margin: 2rem auto;
  padding: 0 2rem;
`;

export default Page;
