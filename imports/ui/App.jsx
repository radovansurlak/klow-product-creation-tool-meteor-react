import { React, Component } from 'react';
import ReactFileReader from 'react-file-reader';

import { Box, Heading } from 'grommet';


export default class App extends Component {
  handleFiles(files) {
    console.log(files)
  }
  render() {
    return (
      <div>
        <Box border={{ color: 'brand', size: 'large' }} pad='xlarge'>
          <Heading>Klow Product Creator</Heading>
          <ReactFileReader handleFiles={this.handleFiles}>
            <button className='btn'>Upload</button>
          </ReactFileReader>
        </Box>
      </div>
    )
  }
}




export default App;
