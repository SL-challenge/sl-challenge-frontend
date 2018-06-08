import React from 'react';
import Button from '@material-ui/core/Button';
import FrequencyDialog from './FrequencyDialog';

export default class ButtonBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      clicked: false,
      open: false,
    }
  }

  handleGetPeopleClick = (e) => {
    this.props.getPeople();
  }

  handleClose = () => {
    this.setState({ open: false });
  };

  handleLetterFrequencyClick = (e) => {
    this.setState((prevState, prevProps) => {
      let people = prevProps.people;
      let letterHash = {};
      if (!people) {
        return { open: true };
      }
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

  render() {
    return (
      <div className="App-intro">
        {
          !this.props.clicked &&
          <Button variant="contained" color="primary" onClick={this.handleGetPeopleClick}>
            Get People
          </Button>
        }
        {
          this.props.clicked &&
          <p>Scroll down for more People</p>
        }
        <div>
          <Button variant="contained" color="primary" onClick={this.handleLetterFrequencyClick}>
              Get Letter Fequency
          </Button>
          <FrequencyDialog
            open={this.state.open}
            handleClose={this.handleClose}
            letterHash={this.state.letterHash}
          />
        </div>
      </div>
    )
  }
}