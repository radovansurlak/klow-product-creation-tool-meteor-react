import { Meteor } from 'meteor/meteor';

const callWithPromise = (method, myParameters) => new Promise((resolve, reject) => {
  Meteor.call(method, myParameters, (err, res) => {
    if (err) reject(err);
    resolve(res);
  });
});

export default callWithPromise;
