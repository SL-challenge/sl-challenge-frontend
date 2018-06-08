import React from 'react';
import logo from '../logo.svg';
import nodeLogo from '../node.svg';

export default class Header extends React.Component {
  render() {
    return (
      <header className="App-header">
        <img src={nodeLogo} className="App-logo" alt="nodejs logo" />
        <img src={logo} className="App-logo" alt="react logo" />
        <h1 className="App-title">Graham Lutz's SalesLoft Challenge</h1>
      </header>
    )
  }
}