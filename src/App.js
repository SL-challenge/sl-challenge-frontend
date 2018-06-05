import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import logo from './logo.svg';
import nodeLogo from './node.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 1
    }
  }

  handleButtonClick = (e) => {
    axios.get(`https://localhost:1701/users`)
      .then(res => {
        const persons = res.data.data;
        this.setState({ persons });
      })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={nodeLogo} className="App-logo" alt="nodejs logo" />
          <img src={logo} className="App-logo" alt="react logo" />
          <h1 className="App-title">Graham Lutz's SalesLoft Challenge</h1>
        </header>
        <p className="App-intro">
          <Button variant="contained" color="primary" onClick={this.handleButtonClick}>
            Click Me
          </Button>
        </p>
        <div className="persons-container">
        {this.state.persons && [...this.state.persons].map((person, idx) => {
          return <p key={idx}>{person.email_address}</p>
        })}
        </div>
      </div>
    );
  }
}

export default App;
