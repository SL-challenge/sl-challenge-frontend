import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import Zoom from '@material-ui/core/Zoom';
import axios from 'axios';
import logo from './logo.svg';
import nodeLogo from './node.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      nextPage: 1,
      clicked: false,
      open: false
    }
  }

  componentDidMount() {
    // window.addEventListener('scroll', this.handleScroll)
  }

  handleLetterFrequencyClick = (e) => {
    this.setState((prevState) => {
      let people = prevState.people;
      let letterHash = {};
      people.forEach((person) => {
        person.email_address.split('').forEach((char) => {
          if (!letterHash[char]) {
            letterHash[char] = 1;
          }
          else {
            letterHash[char]++
          }
        })
      })
      return {
        letterHash,
        open: true
      }
    });
  }

  handleClose = () => {
    this.setState({ open: false });
  };

  handleButtonClick = (e) => {
    this.getPeople();
  }

  getPeople = () => {
    let url = 'https://localhost:1701/users';
    if (this.state.nextPage) {
      url += '?page=';
      url += this.state.nextPage;
    }
    this.setState({isLoadingItems: true})
    axios.get(url).then(this.addPeople)
  }

  addPeople = (res) => {
    this.setState((prevState) => {
      let prevPeople = prevState.people || [];
      let nextPeople;
      let nextPage;
      let people;

      if (res.data && res.data.data) {
        nextPeople = res.data.data;
      }

      if (res.data && res.data.metadata && res.data.metadata.paging && res.data.metadata.paging.next_page) {
        nextPage = res.data.metadata.paging.next_page
      }

      people = prevPeople.concat(nextPeople);

      return {
        people,
        nextPage,
        clicked: true,
        isLoadingItems: false
      }
    });
  }

  shouldLoadMoreRows = (scrollTop, gridBottom) => {
    if (this.state.isLoadingItems) {
      return false;
    }

    return gridBottom - scrollTop < 750;
  };

  handleScroll = (event) => {
    const scrollTop = event.target.scrollTop;
    const gridBottom = event.target.childNodes[0].clientHeight;
    if (this.shouldLoadMoreRows(scrollTop, gridBottom)) {
      this.setState({ isLoadingItems: true }, () => {
        console.log('loading rows');
        this.getPeople();
      });
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={nodeLogo} className="App-logo" alt="nodejs logo" />
          <img src={logo} className="App-logo" alt="react logo" />
          <h1 className="App-title">Graham Lutz's SalesLoft Challenge</h1>
        </header>
        <div className="App-intro">
          {
            !this.state.clicked &&
            <Button variant="contained" color="primary" onClick={this.handleButtonClick}>
              Click Me
            </Button>
          }
          {
            this.state.clicked &&
            <p>Scroll down for more</p>
          }
          <div>
            <Button variant="contained" color="primary" onClick={this.handleLetterFrequencyClick}>
                Get Letter Fequency
            </Button>
            <Dialog
              fullScreen={false}
              open={this.state.open}
              onClose={this.handleClose}
              aria-labelledby="responsive-dialog-title"
            >
              <DialogTitle id="responsive-dialog-title">{"Email Address Character Frequency"}</DialogTitle>
              <DialogContent>
                  {this.state.letterHash && Object.keys(this.state.letterHash).sort().map((letter, idx) => {
                    return (
                      <div key={idx}>
                        <div className='letter-container'>{letter}</div>
                        <div className='letter-container'>{this.state.letterHash[letter]}</div>
                      </div>
                    )
                  })}
              </DialogContent>
              <DialogActions>
                <Button onClick={this.handleClose} color="primary" autoFocus>
                  Close
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        </div>
        <div className="persons-container" onScroll={this.handleScroll}>
          <Grid container spacing={24}>
            {
              this.state.people && [...this.state.people].map((person, idx) => {
              return (
                <Grid item md key={idx}>
                  <Zoom in={true}>
                    <Card raised={true}>
                      <div className='card-container'>
                        <p>{person.first_name + ' ' + person.last_name}</p>
                        <p>{person.title}</p>
                        <p>{person.email_address}</p>
                      </div>
                    </Card>
                  </Zoom>
                </Grid>
              )
            })
            }
          </Grid>
          {
              this.state.isLoadingItems &&
              <div className='progress-bar'>
                <CircularProgress />
              </div>
            }
        </div>
      </div>
    );
  }
}

export default App;
