import React, { Component } from 'react';
import Papa from 'papaparse';

class FileReader extends Component {
  constructor() {
    super();
    this.state = {
      csvfile: undefined,
    };
    this.updateData = this.updateData.bind(this);
  }

  handleChange = (event) => {
    this.setState({
      csvfile: event.target.files[0],
    });
  }

  importCSV = () => {
    const { csvfile } = this.state;
    Papa.parse(csvfile, {
      complete: this.updateData,
      header: true,
    });
  }

  updateData = (result) => {
    const { data } = result;
    console.log(data);
  }

  render() {
    return (
      <div>
        <input
          type="file"
          ref={(input) => {
            this.filesInput = input;
          }}
          name="file"
          placeholder={null}
          onChange={this.handleChange}
        />
        <button type="button" onClick={this.importCSV}> Upload now!</button>
      </div>
    );
  }
}

export default FileReader;
