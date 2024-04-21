import React, { Component } from 'react';
import HomePage from './HomePage';
import '../scss/components/_global.scss';

export default class App extends Component {
  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <React.StrictMode>
        <HomePage />
      </React.StrictMode>
    );
  }
}
