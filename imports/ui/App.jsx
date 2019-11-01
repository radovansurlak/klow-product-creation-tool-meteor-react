import React from 'react';
import { Meteor } from 'meteor/meteor';
import CSVProcessor from './CSVProcessor';

const App = () => {
  Meteor.call('getMetafieldData', 'armedangels-aado-t-shirt-deep-green-organic-cotton', (error, result) => {
    console.log(error, result);
  });
  return <CSVProcessor />;
};

export default App;
