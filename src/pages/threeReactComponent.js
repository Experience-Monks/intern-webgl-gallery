import React, { Component } from 'react';
import ThreeCanvas from './ThreeCanvas';

export default class ThreeReactComponent extends Component {
  componentDidMount() {
    ThreeCanvas(this.scene);
  }

  render() {
    return (
      <>
        <div ref={(element) => (this.scene = element)} />
      </>
    );
  }
}
