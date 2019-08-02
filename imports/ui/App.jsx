import React, { Component } from 'react';

import { Box, Heading } from 'grommet';

import FileReader from './FileReader';

const App = () => (
  <div>
    <Box border={{ color: 'brand', size: 'large' }} pad="xlarge">
      <Heading>Klow Product Creator</Heading>
      <FileReader />
    </Box>
  </div>
);

export default App;
