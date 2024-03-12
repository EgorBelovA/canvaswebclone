import Canvas from './Canvas';
import { render } from 'react-dom';
import React, { Component } from 'react';
import HomePage from './HomePage';

export default class App extends Component {
  constructor(props) {
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

const appDiv = document.getElementById('app');
render(<App />, appDiv);
