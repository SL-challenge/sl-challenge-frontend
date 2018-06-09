import React from 'react';
import Button from '@material-ui/core/Button';
import CustomDialog from './CustomDialog';
import Duplicates from './Duplicates';

export default class ButtonBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      clicked: false,
      frequencyOpen: false
    }
  }

  handleGetPeopleClick = (e) => {
    this.props.getPeople();
  }

  handleClose = () => {
    this.setState({ frequencyOpen: false });
  };

  handleLetterFrequencyClick = (e) => {
    this.setState((prevState, prevProps) => {
      let people = prevProps.people;
      let data = {};

      if (!people) {
        return { frequencyOpen: true };
      }

      people.forEach((person) => {
        person.email_address.split('').forEach((char) => {
          if (!data[char]) {
            data[char] = 1;
          }
          else {
            data[char]++
          }
        })
      })

      return {
        data,
        frequencyOpen: true
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
          <CustomDialog
            frequency
            id={'frequency'}
            open={this.state.frequencyOpen}
            handleClose={this.handleClose}
            data={this.state.data}
            title={"Email Address Character Frequency"}
          />
          <Duplicates people={this.props.people}/>
        </div>
      </div>
    )
  }
}