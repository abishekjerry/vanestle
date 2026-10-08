import React from 'react';
import { Container } from '@mui/material';
import { Labels } from '../../utils/constants/labels';


const PContainer = ({
  children,
  maxWidth = Labels.lg,
  disableGutters = false,
  style,
  containerProps = {}
}) => {
  return (
    <Container
      maxWidth={maxWidth}
      disableGutters={disableGutters}
      style={style}
      {...containerProps}
    >
      {children}
    </Container>
  );
};

export default PContainer;
