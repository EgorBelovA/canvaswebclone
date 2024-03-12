import React, { Component } from 'react';
import Canvas from './Canvas';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

export default class HomePage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Router>
        <Routes>
          <Route path='/' element={<>Hello</>}></Route>
          <Route path='canvas' element={<Canvas></Canvas>} />
        </Routes>
      </Router>
    );
  }
}
