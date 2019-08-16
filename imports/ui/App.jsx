import React from 'react';

import { Grommet, Box, Heading } from 'grommet';

import CSVProcessor from './CSVProcessor';

const myTheme = {
  global: {
    font: {
      family: 'Roboto',
    },
  },
};

const App = () => (
  <div>
    <Grommet theme={myTheme}>
      <Box border={{ color: 'brand', size: 'large' }} pad="xlarge">
        <Heading>Klow Product Creator</Heading>
        <CSVProcessor />
      </Box>
    </Grommet>
  </div>
);

export default App;
